import fs from 'fs'


export const util = {
    unix: {
        int: () => {
            return Math.floor(Date.now() / 1000)
        },
        float: () => {
            return Date.now() / 1000
        },
        str: () => {
            return Math.floor(Date.now() / 1000).toString()
        },


        day: () => {
            return new Date().getDate()
        },
        month: () => {
            return new Date().getMonth() + 1
        },
        year: () => {
            return new Date().getFullYear()
        },

        is: (data) => {
            // Check if the string contains only digits
            if (!/^\d+$/.test(data)) {
                return false;
            }

            // Convert the string to a number and check if it's a valid Unix timestamp
            const timestamp = parseInt(data, 10);
            return timestamp.toString().length === data.length && timestamp > 0 && timestamp < 2147483648;
        }
    },
    log: (message) => {
        console.log(`[LIXBASE] ${extra.colours.cyan}INFO: ${extra.colours.reset} ${message} `)
    },
    error: (message) => {
        console.log(`[LIXBASE] ${extra.colours.red}ERROR: ${extra.colours.reset} ${message} `)
    },
    feature(message) {
        console.log(`[LIXBASE] ${extra.colours.yellow}FEATURE: ${extra.colours.reset} ${message} `)
    },

    nextId(str) {
        if (str == ""){
            return "0"
        }


        //flip the string, and turn it into an array
        let reverseArray = str.split("").reverse()
        let nums = []
        
        for (let i = 0; i < reverseArray.length; i++) {
            const char = reverseArray[i];
            //check if the char is a integer
            if (parseInt(char) == char) {
                nums.push(char)
            }
            else {
                break
            }
        }

        //flip the array back
        nums.reverse()

        //turn array into string, then number
        let num = parseInt(nums.join(""))
        num += 1
        return num.toString()
    }
}



const extra = {
    colours: {
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        reset: "\x1b[0m"
    }
}








export async function checkExistence(path) {
    return new Promise(async (resolve, reject) => {
        resolve(fs.existsSync(path))
    })
}

export async function writeJSON(path, data) {
    return new Promise(async (resolve, reject) => {
        await fs.writeFileSync(path, JSON.stringify(data))
        resolve(true)
    })
}

export async function readJSON(path) {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(JSON.parse(await fs.readFileSync(path, 'utf8')))
        } catch (err) {
            reject(err)
        }
    })
}


export async function createFolder(name) {
    return new Promise(async (resolve, reject) => {
        fs.mkdirSync(name)
        resolve(true)
    })
}