import {
    checkExistence,
    createFolder,
    lb,
    readJSON,
    writeJSON
} from "./essentials.js"
import fs from "fs"











class Lixbase {
    version = '1.0.0'
}

Lixbase.Client = class {
    constructor() {
        this.data = null,
        this.shard = 'N1',
        this.autosave = true,
        this.debug = false,
        this.objectOrientation = {},
        this.dir = 'LB_DATA',
        this.databaseOrientation = {
            //WARNING! DANGEROUS TO CHANGE!
            'id': {

            },
            'batch': {

            }
        }
    }

    async debug (bool) {
        this.debug = bool
    }



    addObject(name, data={}, idsteps=2) {
        var id = lb.id.sharded(idsteps, this.shard)
        while (this.data.batch[name].includes(id)){
            id = lb.id.sharded(idsteps, this.shard)
        }

        this.data.batch[name].push(id)
        let objectData = this.objectOrientation[name]
        objectData.id = id
        objectData.type = name

        for (var key in data) {
            objectData[key] = data[key]
        }


        this.data.id[id] = objectData
        return id
    }


    removeObject(id) {
        if (this.data.id[id] == undefined) {
            lb.error(`Object ${id} does not exist.`)
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



    handle(id) {
        
    }



    async init (shard) {
        return new Promise(async (resolve, reject) => {
            lb.log(`Loading ${shard} data...`)
            this.shard = shard

            if (await checkExistence(this.dir) == false) {
                //check for folder
                lb.log(`No folder found. Creating a Lixbase folder (${this.dir})...`)
                await createFolder(this.dir)

                await writeJSON(`${this.dir}/${shard}.json`,this.databaseOrientation)

                //set data
                this.data = this.databaseOrientation

                lb.log(`Created ${shard} shard data.`)
            }
            else {
                if (await checkExistence(`${this.dir}/${shard}.json`) == false) {
                    //check for file
                    lb.log(`No shard data found. Creating ${shard} shard data...`)
                    
                    await writeJSON(`${this.dir}/${shard}.json`, this.databaseOrientation)

                    this.data = this.databaseOrientation
                    lb.log(`Created ${shard} shard data.`)
                }
                else {

                    //check if data is corrupted, else set data!
                    try {
                        this.data = await readJSON(`${this.dir}/${shard}.json`)
                    }
                    catch(err){
                        lb.error(`The ${shard} shard data seems to be corrupted. Please replace the file.`)
                        //kill script
                        return
                    }
                    


                }
            }     
            
            for (var orientation in this.objectOrientation) {
                if (this.data.batch[orientation] == undefined) {
                    lb.log(`No ${orientation} batch found. Creating ${orientation} batch...`)
                    this.data.batch[orientation] = []
                    lb.log(`Created ${orientation} batch.`)
                }
            }



            await this.save()

            if (this.autosave > 0) {
                setInterval(async () => {
                    await this.save()
                }, this.autosave * 1000)
                lb.feature(`Autosaving every ${this.autosave} seconds.`)
            }


            lb.log(`Loaded ${shard} data.`)
            

            resolve()
        })
    }



    
    async save () {
        return new Promise(async (resolve, reject) => {
            try {
                await fs.writeFileSync(`${this.dir}/${this.shard}.json`, JSON.stringify(this.data))
            } catch (err) {
                lb.error(`Couldn't save ${this.shard} shard data: ${err}`)
            }
            resolve()
        })
    }


}

export default Lixbase;