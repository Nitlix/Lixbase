const fs = require('fs');
const path = require('path');


function checkFileExistence(filePath){
    //filepath input
    //has to become ../filePath
    const actualPath = path.join(__dirname, '../', filePath)
    if (fs.existsSync(actualPath)) {
        return true
    }

    return false;
}

module.exports = checkFileExistence;