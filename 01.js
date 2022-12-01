const { readFile } = require('./helpers/init')
const input = readFile('input/01-1.txt').split('\n\n')
// ---------------------------------------------

const result = input.map(x => x.split('\n').reduce((acc, x) => (acc + (parseInt(x) || 0)), 0))
console.log(result, '\n\nMax energy: ', Math.max(...result))
console.log('\n\nTop 3 energy: ', result.sort((x,y) => y - x).slice(0,3).reduce((acc, x) => (acc + x), 0))
