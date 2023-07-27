const fs = require("fs")

module.exports = function(path, data){  
    fs.writeFileSync(path, data)
}