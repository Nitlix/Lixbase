const fs = require("fs")

module.exports = function(path){
    fs.mkdirSync(path)
}