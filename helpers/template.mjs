import * as U from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
// import Deque from "double-ended-queue";
const input = (await U.readFile('input/tmp.txt')).split('\n').slice(0,-1)
// ---------------------------------------------

let a,b,c,d

console.table(input)

input.forEach( (line, i) => {
    [a, b] = line.split(' ')
})

console.log('Part 1', 0)
U.took('part 1')