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
        // Check if the string is empty, then initialize the string with "N1-0"
        if (str === "") {
            return "0";
        }

        // Get the last digit in the string
        const lastDigitIndex = str.lastIndexOf("-");
        const lastDigit = parseInt(str.slice(lastDigitIndex + 1), 10);

        // Check if the last character in the string is a digit
        if (Number.isNaN(lastDigit)) {
            return ""; // If the last character is not a digit, return an empty string
        }

        // Increment the last digit and replace it in the original string
        const newLastDigit = (lastDigit + 1) % 10;

        // Get the substring that contains the new number string
        const newNumberStr = str.slice(0, lastDigitIndex + 1) + newLastDigit;

        return newNumberStr;
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