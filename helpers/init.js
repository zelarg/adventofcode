const fs = require('fs')

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

module.exports = {
    readFile
}