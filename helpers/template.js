import * as utils from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
const input = (await utils.readFile('input/11-1.txt')).split('\n')
// ---------------------------------------------

let a,b,c,d
let r

input.forEach( (line, i) => {
    [a, b] = line.split(' ')
})



r = input

console.table(r)
utils.took('part 1')