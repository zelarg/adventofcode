import * as U from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
const input = (await U.readFile('input/18-1.txt')).split('\n').slice(0,-1)
// ---------------------------------------------

let a, b, c, d
let sides1 = new Set()

input.forEach( (line, i) => {
    [a, b, c] = line.split(',')

    sides1.add([+a,+b,+c,+a+1,+b,+c+1].join(','))
    sides1.add([+a,+b,+c,+a+1,+b+1,+c].join(','))
    sides1.add([+a,+b,+c,+a,+b+1,+c+1].join(','))
    sides1.add([+a,+b,+c+1,+a+1,+b+1,+c+1].join(','))
    sides1.add([+a,+b+1,+c,+a+1,+b+1,+c+1].join(','))
    sides1.add([+a+1,+b,+c,+a+1,+b+1,+c+1].join(','))
})
// console.log(sides)

console.log('Unique sides', sides1.size, ', Total sides', input.length * 6)
console.log('Part 1', input.length * 6 - (input.length * 6 - sides1.size) * 2)

U.took('part 1')

// let squares = []
let [minA, minB, minC] = [100,100,100]
let [maxA, maxB, maxC] = [0,0,0]

let squaresS = new Set()
input.forEach( (line, i) => {
    [a, b, c] = line.split(',')
    a=+a; b=+b; c=+c;
    minA = Math.min(minA, a-1)
    minB = Math.min(minB, b-1)
    minC = Math.min(minC, c-1)
    maxA = Math.max(maxA, a+1)
    maxB = Math.max(maxB, b+1)
    maxC = Math.max(maxC, c+1)
    squaresS.add([a,b,c].join(','))
})

// console.log('Min/max', minA, minB, minC, maxA, maxB, maxC)
// generate bounding area, starting from minA, minB, minC, creeping to maxA, maxB, maxC
let bounding = new Set()
let explore = [[minA, minB, minC]]
while (explore.length) {
    let [ea, eb, ec] = explore.pop()

    for (let [i, point] of [[ea-1, eb, ec], [ea+1, eb, ec], [ea, eb-1, ec], [ea, eb+1, ec], [ea, eb, ec-1], [ea, eb, ec+1]].entries()) {
        let pointStr = point.join(',')
        let isBuild = squaresS.has(pointStr)
        let isBounding = bounding.has(pointStr)
        if (!isBuild && !isBounding && !(point[0]< minA || point[0] > maxA || point[1] < minB || point[1] > maxB || point[2] < minC || point[2] > maxC)) {
            bounding.add(pointStr)
            explore.push(point)
        }

    }

}

let boundingSides = new Set()

bounding.forEach( (line, i) => {
    [a, b, c] = line.split(',')

    boundingSides.add([+a,+b,+c,+a+1,+b,+c+1].join(','))
    boundingSides.add([+a,+b,+c,+a+1,+b+1,+c].join(','))
    boundingSides.add([+a,+b,+c,+a,+b+1,+c+1].join(','))
    boundingSides.add([+a,+b,+c+1,+a+1,+b+1,+c+1].join(','))
    boundingSides.add([+a,+b+1,+c,+a+1,+b+1,+c+1].join(','))
    boundingSides.add([+a+1,+b,+c,+a+1,+b+1,+c+1].join(','))
})

let total = 0
sides1.forEach(s=>{
    if (boundingSides.has(s)) {
        total++
    }
})

console.log('Part 2', total)
U.took('part 2')

// Unique sides 8183 , Total sides 13020
// Part 1 3346
// -- [part 1] took 10.35 ms --
// Part 2 1980
// -- [part 2] took 45.34 ms --

