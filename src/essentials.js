export const lb = {
    id: {
        sharded: (steps, shard = "N1") => {
            //generate random uuid (steps) times
            let id = ""
            for (let i = 0; i < steps; i++) {
                id += Math.random().toString(36).substring(2, 15)
            }
            return `${shard}-${unix.str()}-${id}`
        },
        random: (steps) => {
            //generate random uuid (steps) times
            let id = ""
            for (let i = 0; i < steps; i++) {
                id += Math.random().toString(36).substring(2, 15)
            }
            return `${id}`
        }
    },
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
        }
    },
    log: (message) => {
        console.log(`[LIXBASE] ${util.colours.cyan}INFO: ${util.colours.reset} ${message} `)
    }
}



const util = {
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


