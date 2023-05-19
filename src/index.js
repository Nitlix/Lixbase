import {
    checkExistence,
    createFolder,
    util,
    readJSON,
    writeJSON
} from "./essentials.js"
import fs, { copyFileSync, lstat } from "fs"











class Lixbase {
    version = '1.0.0'
}

Lixbase.Client = class {
    constructor() {
        this.data = null,
        this.shard = 'N1',
        this.autosave = true,
        this.debug = false,
        this.objects = {},
        this.dir = 'LB_DATA',
        this.databaseOrientation = {
            //WARNING! DANGEROUS TO CHANGE!
            'id': {

            },
            'batch': {

            }
        },
        this.format = {
            id: '[SHARD]-[TIME]-[RANDOM]',
            next: '[SHARD]-0'
        }
    }





    genId = {
        gen: (steps) => {
            //generate random uuid (steps) times
            let random = ""
            for (let i = 0; i < steps; i++) {
                random += Math.random().toString(36).substring(2, 15)
            }

            //new format copy
            let format = this.format.id.toString()

            //replace all the other placeholders
            format = format.replace('[SHARD]', this.shard)
            format = format.replace('[TIME]', util.unix.str())
            format = format.replace('[RANDOM]', random)
            



            return format        
        },
        pure: (steps) => {
            //generate random uuid (steps) times
            let id = ""
            for (let i = 0; i < steps; i++) {
                id += Math.random().toString(36).substring(2, 15)
            }
            return `${id}`
        }
    }


    addObject(name, data={}, idsteps=2) {
        let id = this.genId.gen(idsteps, this.shard)
        while (this.data.id[id] != undefined){
            id = this.genId.gen(idsteps, this.shard)
        }

        //unique copy
        let objectData = JSON.parse(JSON.stringify(this.objects[name]))

        //set main properties
        objectData.id = id
        objectData.type = name

        //set custom properties
        for (var key in data) {
            objectData[key] = data[key]
        }

        //push to database
        this.data.batch[name].push(id)
        this.data['id'][id] = objectData

        return id
    }



    removeObject(id) {
        if (this.data.id[id] == undefined) {
            util.error(`Object ${id} does not exist.`)
            return false
        }
        else {
            type = this.data.id[id].type
            delete this.data.id[id]
            this.data.batch[type].splice(this.data.batch[type].indexOf(id), 1)
        }
    }


    getObject(id) {
        try {
            return this.data.id[id]
        }
        catch (e) {
            return false
        }
    }


    getSpecificObject(name, id) {
        try {
            return this.data.batch[name][id]
        }
        catch (e) {
            return false
        }
    }


    


    validate(data, checks){
        for (var key in checks) {
            switch (key) {
                case 'type': 
                    let lookingFor = checks[key]
                    if (lookingFor.includes(data.type.toString()) == false){
                        return false
                    }
                    break;
                case 'minLen':
                    let minLen = checks[key]
                    if (data.length < minLen) {
                        return false
                    }
                    break;
                case 'maxLen':
                    let maxLen = checks[key]
                    if (data.length > maxLen) {
                        return false
                    }
                    break;
                
                case 'min':
                    let min = checks[key]
                    if (data < min) {
                        return false
                    }
                    break;
                case 'max':
                    let max = checks[key]
                    if (data > max) {
                        return false
                    }
                    break;
                case 'unix':
                    //check if data is unix timestamp

                    if (util.unix.is(data) == false) {
                        return false
                    }
                    break;
                
                case 'regex':
                    let regex = checks[key]
                    if (regex.test(data) == false) {
                        return false
                    }
                    break;
            }
        }
        return true
    }



    query(objects=[], callBackCheck=(data)=>{util.feature("This is the default query callback function!")}, returningData=[]){
        var finalData = {}
        if (objects != "*"){
            objects.forEach(object => {
                try {
                    this.data.batch[object].forEach(id => {
                        let data = this.data.id[id]
                        if (callBackCheck(data) == true){
                            finalData[id] = {}
                            returningData.forEach(key => {
                                finalData[id][key] = data[key]
                            })
                        }
                    })
                }
                catch (e) {
                    util.error(`Object type ${object} does not exist.`)
                }
            })
        }

        else {
            //go through dict of all ids
            for (var id in this.data.id) {
                let data = this.data.id[id]
                if (callBackCheck(data) == true){
                    finalData[id] = {}
                    returningData.forEach(key => {
                        finalData[id][key] = data[key]
                    })
                }
            }
        }

        return finalData
    }





    async init (shard) {
        return new Promise(async (resolve, reject) => {
            util.log(`Loading ${shard} data...`)
            this.shard = shard

            if (await checkExistence(this.dir) == false) {
                //check for folder
                util.log(`No folder found. Creating a Lixbase folder (${this.dir})...`)
                await createFolder(this.dir)

                await writeJSON(`${this.dir}/${shard}.json`,this.databaseOrientation)

                //set data
                this.data = this.databaseOrientation

                util.log(`Created ${shard} shard data.`)
            }
            else {
                if (await checkExistence(`${this.dir}/${shard}.json`) == false) {
                    //check for file
                    util.log(`No shard data found. Creating ${shard} shard data...`)
                    
                    await writeJSON(`${this.dir}/${shard}.json`, this.databaseOrientation)

                    this.data = this.databaseOrientation
                    util.log(`Created ${shard} shard data.`)
                }
                else {

                    //check if data is corrupted, else set data!
                    try {
                        this.data = await readJSON(`${this.dir}/${shard}.json`)
                    }
                    catch(err){
                        util.error(`The ${shard} shard data seems to be corrupted. Please replace the file.`)
                        //kill script
                        return
                    }
                    


                }
            }     
            
            for (var orientation in this.objects) {
                if (this.data.batch[orientation] == undefined) {
                    util.log(`No ${orientation} batch found. Creating ${orientation} batch...`)
                    this.data.batch[orientation] = []
                    util.log(`Created ${orientation} batch.`)
                }
            }



            await this.save()


            //Enable autosave
            if (this.autosave > 0) {
                setInterval(async () => {
                    await this.save()
                }, this.autosave * 1000)
                util.feature(`Autosaving every ${this.autosave} seconds.`)
            }



            util.log(`Loaded ${shard} data.`)
            

            resolve()
        })
    }



    
    async save () {
        return new Promise(async (resolve, reject) => {
            try {
                await fs.writeFileSync(`${this.dir}/${this.shard}.json`, JSON.stringify(this.data))
            } catch (err) {
                util.error(`Couldn't save ${this.shard} shard data: ${err}`)
            }
            resolve()
        })
    }


}

export default Lixbase;