import * as U from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
// import Deque from "double-ended-queue";
const input = (await U.readFile('input/20-1.txt')).split('\n').slice(0,-1)
// ---------------------------------------------

let inp1 = []
let inp2 = []

let mult = 811589153

input.forEach( (line, i) => {
    inp1.push([+line, i])
    inp2.push([+line*mult, i])
})

let ln = inp1.length

function mix(inp) {
    for (let it = 0; it < ln; it++) {
        let [num, pos] = inp[it]
        let newPosition = pos + num

        if (num > 0 && newPosition > ln-1) {
           newPosition = newPosition % (ln-1)
        }

        if (num < 0 && newPosition < 1) {
           newPosition += Math.ceil((-newPosition)/(ln-1)) * (ln-1)
        }

        // console.log('moving', num, 'from', pos, 'to newPosition',newPosition)
        for (let line of inp) {
            if (newPosition > pos && line[1] > pos && line[1] <= newPosition) {
                // going right
                line[1]--
            }
            if (newPosition < pos && line[1] < pos && line[1] >= newPosition) {
                // going left
                line[1]++
            }
        }
        inp[it][1] = newPosition
        // let sorted = U.clone(inp); console.log(U.sort(sorted, '1').map(x=>x[0]).join(','))
    }
}

function coordsSum(inp) {
    let zero = inp.find(x=>x[0]==0)[1]

    let k1 = (zero+1000)%ln
    let k2 = (zero+2000)%ln
    let k3 = (zero+3000)%ln

    let rs = inp.filter(x=>[k1, k2, k3].includes(x[1])).map(x=>x[0])
    return U.sum(rs)
}

mix(inp1)

console.log('Part1', coordsSum(inp1))
U.took('part 1')

for (let t = 0; t<10; t++) {
    mix(inp2)
}

console.log('Part2', coordsSum(inp2))
U.took('part 2')

// Part1 19559
// -- [part 1] took 77.79 ms --
// Part1 912226207972
// -- [part 2] took 1218.88 ms --