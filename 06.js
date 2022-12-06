const { readFile, sumAll } = require('./helpers/init')
const input = readFile('input/06-1.txt').slice(0, -1)
// ---------------------------------------------

const findPos = (l) => {
    let acc = [];
    let pos = 0;
    input.split('').some( (x, i) => {
        acc.push(x)
        if (acc.length > l)  {
            acc.splice(0,1)
            if (acc.length === [...new Set(acc)].length) { pos = i+1; return true }
        }
    });
    return pos
}

console.log(findPos(4))
console.log(findPos(14))
