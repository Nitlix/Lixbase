import {
    lb
} from "./essentials.js"
import fs from "fs"







const lb_data = {
    'id': {

    },
    'batch': {

    }
}




class Lixbase {


}

Lixbase.Client = class {
    constructor() {
        this.data = null,
        this.shard = 'N1',
        this.autosave = true
    }

    async init (shard) {
        return new Promise(async (resolve, reject) => {
            lb.log(`Loading ${shard} data...`)
            this.shard = shard
            try {
                this.data = await fs.readFileSync(`lb_data/${shard}.json`, 'utf8')
            } catch (err) {
                await fs.writeFileSync(`lb_data/${shard}.json`, JSON.stringify(lb_data))
                this.data = lb_data
                lb.log(`No data found. Created ${shard} data.`)
            }

            lb.log(`Loaded ${shard} data.`)

            resolve()
        })
    }

    async feed() {}

    async save () {
        try {
            await fs.writeFileSync(`/lb_data/${shard}.json`, JSON.stringify(this.data))
        } catch (err) {
            lb.log(`Error saving ${shard} data: ${err}`)
        }

    }


}

export default Lixbase;