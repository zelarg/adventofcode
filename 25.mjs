import * as U from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
// import Deque from "double-ended-queue";
const input = (await U.readFile('input/25-1.txt')).split('\n').slice(0,-1)
// ---------------------------------------------

let sum = 0

input.forEach( (line, i) => {
    for (let j=0; j < line.length; j++) {
        let pos = line.length - j
        let digit = line[j]
        if (digit == '=') digit = -2
        if (digit == '-') digit = -1
        sum += digit * 5**(pos-1)
    }
})

function toSnafu(num) {
    if (num <= 2) {
        return num
    }
    let lastNum = num % 5
    let snafuChar = (lastNum == 3) ? '=' : (lastNum == 4) ? '-' : lastNum
    if (lastNum > 2) num+=5

    return '' + toSnafu(Math.floor(num / 5)) + snafuChar
}

console.log('Part 1:', sum)
U.took('part 1')

console.log('Part 2:', toSnafu(sum))
U.took('part 2')