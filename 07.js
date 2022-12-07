const {readFile, sumAll} = require('./helpers/init')
const input = readFile('input/07-1.txt').split('\n').slice(0, -1).slice(1)
// ---------------------------------------------

let curPath = prevPath = '';
let dirs = [];
let size = 0;

input.concat(Array(5).fill('$ cd ..')).forEach(x => {
    [a, b, c] = x.split(' ')
    if (a + b == '$cd') {
        // flush anything from size to prev
        dirs[curPath] = (!dirs[curPath]) ? size : dirs[curPath] + size
        prevPath = curPath
        size = 0
        if (c != '..') {
            curPath = prevPath + '/' + c
            dirs[curPath] = 0
        } else if (curPath != '') {
            curPath = prevPath.replace(/^(.*)\/.+?$/, '$1')
            dirs[curPath] += dirs[prevPath]
        }
    }
    if (a.match(/\d+/)) {
        size += +a;
    }
})

let dirSizes = Object.entries(dirs)
let r = dirSizes.filter(x => x[1] <= 100000).reduce((acc, x) => (acc + x[1]), 0)
console.log('Part 1', r)

let deleteAtLeast = 30000000 - (70000000 - dirSizes.find(x => x[0] == '')[1])
let r2 = dirSizes
    .filter(x => x[1] >= deleteAtLeast)
    .sort((a, b) => a[1] - b[1])[0][1]
console.log('Part 2', r2)



