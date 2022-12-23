import * as U from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
// import Deque from "double-ended-queue";
const input = (await U.readFile('input/21-1.txt')).split('\n').slice(0,-1)
import algebra from 'algebra.js'
// ---------------------------------------------

let a,b

let M = new Map()

input.forEach( (line, i) => {
    [a, b] = line.split(': ')
    M.set(a, b)
})

function calc(key) {
    let c = M.get(key)
    if (c.match(/\d/)) {
        return c
    } else {
        let [a1, op, a2] = c.split(' ')
        return eval(`${calc(a1)} ${op} ${calc(a2)}`)
    }
}

console.log('Part 1:', calc('root'))
U.took('part 1')

// Part 2 -------------
function calc_expression(key) {
    if (key == 'humn') {
        return key
    }
    let c = M.get(key)
    if (c.match(/\d/)) {
        return c
    } else {
        let [a1, op, a2] = c.split(' ')
        return `(${calc_expression(a1)} ${op} ${calc_expression(a2)})`
    }
}

let [eq1, eq2] = M.get('root').split(' + ')

let x1 = algebra.parse(calc_expression(eq1));
let x2 = algebra.parse(calc_expression(eq2));
let eq = new algebra.Equation(x1, x2);

// console.log('algebra: ', eq.toString());
let res = eq.solveFor('humn')

console.log('Part 2:', res.numer);
U.took('part 2')

// Part 1: 104272990112064
// -- [part 1] took 15.11 ms --
// Part 2: 3220993874133
// -- [part 2] took 16.6 ms --