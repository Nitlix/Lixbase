const Unix = require("./Unix");




module.exports = {
    log: (msg, logObj) => {
        logObj.write(`[LIXBASE CLIENT] [${Unix.format("hh:mm:ss dd/MM/YYYY")}] ${msg}\n`)
    }
}