const fs = require('fs');
const path = require('path');


function checkFolderExistence(folderPath){
    //filepath input
    //has to become ../filePath
    const actualPath = path.join(__dirname, '../', folderPath)
    if (fs.existsSync(actualPath)) {
        return true
    }

    return false;
}

module.exports = checkFolderExistence;