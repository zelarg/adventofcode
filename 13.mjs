import * as utils from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
const input = (await utils.readFile('input/13-1.txt')).split('\n\n')
// ---------------------------------------------

let a,b,c,d
let r

// 3 ret values: -1=right, 1=incorrect, 0=continue
function compare(a, b) {
    let isArrA = Array.isArray(a)
    let isArrB = Array.isArray(b)
    if (!isArrA && !isArrB) {
        return (a<b) ? -1 : ( (a>b) ? 1 : 0 )
    }
    if (!isArrA) a = [a]
    if (!isArrB) b = [b]

    let c;
    for (let i = 0; i<Math.min(a.length, b.length); i++) {
        c = compare(a[i], b[i]);
        if (c != 0) {
            return c
        }
    }
    return (a.length<b.length) ? -1 : ( (a.length>b.length) ? 1 : 0 )
}

let allPackets = []

let sum = 0
input.forEach( (line, i) => {
    [a, b] = line.split('\n')
    let isOK = compare(eval(a),eval(b))
    if (isOK == 1) sum += (i+1)
    allPackets.push(a, b)
})

console.log('Part 1', sum)
utils.took('part 1')

allPackets.push('[[2]]', '[[6]]')
allPackets = allPackets.sort((a,b) => compare(eval(a),eval(b)) )

r = (allPackets.indexOf('[[2]]')+1) * (allPackets.indexOf('[[6]]')+1)
console.log('Part 2', r)
utils.took('part 2')

