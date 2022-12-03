const fs = require('fs')

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const sumAll = (arr) => {
    return arr.reduce((acc,x) => (acc + x), 0)
}

module.exports = {
    readFile,
    sumAll
}