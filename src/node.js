const Logger = require("./tools/Logger")
const Unix = require("./tools/Unix")
const checkFolderExistence = require("./tools/checkFolderExistence")
const express = require("express")

const fs = require("fs")
const createFile = require("./tools/createFile")
const createFolder = require("./tools/createFolder")
const readFile = require("./tools/readFile")
const checkFileExistence = require("./tools/checkFileExistence")
const removeFile = require("./tools/removeFile")
const { default: VERSION } = require("../var/VERSION")
const objectIdToPath = require("../tools/objectIdToPath")

/**
 * The node class.
 * @class Node
 */




module.exports = class Node{
    constructor(shard) {
        this.server = express()
        this.server.use(express.json())
        this.server.use(express.urlencoded({ extended: true }))
        this.server.disable('x-powered-by')
        this.server.use((req, res, next) => {
            res.header("X-Powered-By", `Lixbase ${VERSION}`)
            res.header("Access-Control-Allow-Origin", "*")
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            next()
        })



        this.dir = "LB_DATA"
        this.log = {
            name: `launch-${Unix.format("hh-mm-ss-dd-MM-YYYY")}.log`,
            object: null
        }

        this.log.object = fs.createWriteStream(this.dir + "/" + this.log.name, {flags: 'a'})
        this.idFormat = "[UNIX]-[RANDOM]"
        this.defaults = {
            expiryTime: 3600
        }

        Logger.log(`This instance of a Lixbase ${this.version} server has been created.`, this.log.object)


        this.autosave = 10;
        this.autosaveThread = null;


        this.objects = {
        }
        this.cache = {}
        this.cacheCheckers = []

        this.access = {}
    }

    /**
     * Registers a new object type.
     * @param {*} objectName The name of the object type.
     * @param {*} objectData The data that will be used as a template for the object.
     */
    registerObject(objectName, objectData) {
        this.objects[objectName] = {
            collection: [],
            data: objectData
        }
    }


    cacheObject(id){
        const name = objectIdToPath(this.dir, id)
        
        const object = {
            ...JSON.parse(readFile(name)),
            expiry: Unix.int() + this.defaults.expiryTime,
            delete:()=>{this.deleteObject(id)}
        }
        this.cache[id] = object

        this.cacheCheckers.push(
            setTimeout(()=>{
                if (this.cache[id].expiry <= Unix.int()){
                    createFile(name, JSON.stringify(this.cache[id]))
                    delete this.cache[id]
                    Logger.log(`Object "${id}" has naturally expired. A copy was saved.`, this.log.object)
                }
            }, (this.defaults.expiryTime + 1) * 1000)
        )

        return this.cache[id]
    }

    /**
     * Gets the object with a specific id.
     * @param {*} id The id of the object you want to get.
     * @returns {object} Returns the object you requested. Will return false if the object doesn't exist.
     */
    getObject(id){
        if (!this.objects.collection.includes(id)){
            return false;
        }
        if (this.cache[id]){
            return this.cache[id]
        }
        else {
            const name = this.dir + "/id/" + id + ".json"
            if (checkFileExistence(name)){
                return this.cacheObject(id)
            }
            else {
                Logger.log(`CRITICAL ERROR: Object ${id} is in a global collection, however was not found in the cache of the file system. Your data is corrupted.`, this.log.object)
            }
        }
    }

    /**
     * Gets the object with a specific object type name.
     * @param {*} objectName The predefined object type name.
     * @returns {object} Returns the object you requested. Will return false if the object doesn't exist.
     */
    getSpecificObject(objectName, id){
        if (!this.objects[objectName].collection.includes(id)){
            return false;
        }

        return this.getObject(id)
    }


    

    /**
     * Creates a predefined object with the input data.
     * @param {*} objectName The predefined object type name.
     * @param {*} objectData The data you want to input into the object.
     * @returns {object} Returns the object you created.
     */
    createObject(objectName, objectData){
        const id = this.generate.finalId()
        const name = this.dir + "/id/" + id + ".json"
        
        const object = {
            ...this.objects[objectName].data,
            ...objectData,
            id: id,
            type: objectName
        }

        createFile(name, JSON.stringify(object))

        this.objects[objectName].collection.push(id)
        this.objects.collection.push(id)

        return this.cacheObject(id)
    }

    /**
     * Deletes an object with a specific id.
     * @param {*} id The id of the object you want to delete.
     * @returns {boolean} Returns true if the object was deleted, and false if the object was not found.
    */
    deleteObject(id){
        if (!this.objects.collection.includes(id)){
            Logger.log(`at deleteObject() call, the object ${id} was not found in the global collection.`, this.log.object)
            return false;
        }
        
        //remove from all collections
        this.objects.collection.splice(this.objects.collection.indexOf(id), 1)
        const objectData = this.getObject(id)

        this.objects[objectData.type].collection.splice(this.objects[objectData.type].collection.indexOf(id), 1)

        const name = objectIdToPath(this.dir, id)
        if (checkFileExistence(name)){
            removeFile(name)
        }
        
        if (this.cache[id]){
            delete this.cache[id]
        }

        return true;
    }



    shutdown(){
        Logger.log(`Shutting down this node...`, this.log.object)
        this.save()
        clearInterval(this.autosaveThread)

        for (const id in this.cache){
            const name = objectIdToPath(this.dir, id)
            createFile(name, JSON.stringify(this.cache[id]))
            Logger.log(`Saved a final copy of object "${id}" to this node system.`, this.log.object)
        }

        for (const checker of this.cacheCheckers){
            clearTimeout(checker)
        }

        this.log.object.end()
        // bye bye
    }

    /**
     * This function will go through all the objects with a specific object name, and run your query callback on them.
     * @param {*} objectName The name of the object you want to query
     * @param {*} queryCallback The function you want to run on each object with the input of the object's data.
     */
    async query(objectName, queryCallback){
        const objects = this.objects[objectName].collection
        await objects.forEach(async id => {
            if (this.cache[id]){
                await queryCallback(this.cache[id])
            }
            else {
                await queryCallback(this.cacheObject(id))
            }
        })
        return true;
    }


    generate = {
        pure: (char) => {
            //generate a random string with a length of char
            let result = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const charactersLength = characters.length;
            for (let i = 0; i < char; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
        id: () => {
            return this.idFormat
                .replace("[SHARD]", this.shard)
                .replace("[UNIX]", Unix.int())
                .replace("[RANDOM]", this.generate.pure(10))
        },
        finalId: () => {
            let id = this.generate.id(this.shard, this.objects.collection[this.objects.collection.length - 1])
            while (this.objects.collection.includes(id)){
                id =  this.generate.id(this.shard, this.objects.collection[this.objects.collection.length - 1])
            }
            return id
        }
    }


    save(){
        createFile(this.dir + "/" + this.shard + "/objects.json", JSON.stringify(this.objects))
    }

    /**
     * Initialises the server.
     */
    async init(){
        Logger.log(`Following a .init() call for this server with shard: "${this.shard}"...`, this.log.object)

        if (!checkFolderExistence(this.dir)) {
            fs.mkdirSync(this.dir)
            Logger.log(`Created shard "${this.shard}" directory...`, this.log.object)
        }

        //create structure
        if (!checkFolderExistence(this.dir + "/" + this.shard)) {
            Logger.log(`Creating shard "${this.shard}" data...`, this.log.object)

            createFolder(this.dir + "/" + this.shard)
            createFolder(this.dir + "/" + this.shard + "/id")
            
            this.objects.collection = []
            createFile(this.dir + "/" + this.shard + "/objects.json", JSON.stringify(this.objects))
        }

        else {
            Logger.log(`Loading shard "${this.shard}" objects data...`, this.log.object)

            this.objects = {
                ...JSON.parse(readFile(this.dir + "/" + this.shard + "/objects.json")),
                ...this.objects
            }
        }

        if (this.autosave){
            Logger.log(`Autosaving every ${this.autosave} seconds...`, this.log.object)
            this.autosaveThread = setInterval(()=>{
                this.save()
            }, this.autosave * 1000)
        }

        process.on("SIGINT", ()=>{
            this.shutdown()
        })



    }




}


