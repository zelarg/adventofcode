import * as utils from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
const input = (await utils.readFile('input/11-1.txt')).split('\n\n')
// ---------------------------------------------

let a,b,c,d
let r
let monkeys = []
let mo

input.forEach( (line, i) => {
    mo = []
    line.split('\n').forEach( (monkey, j) => {
        [a, b] = monkey.split(': ')
        if (a.match('Starting')) {
            mo['items'] = b.split(', ')
        }
        if (a.match('Operation')) {
            mo['op'] = b.split('= ')[1]
        }
        if (a.match('Test')) {
            mo['test'] = b.split('by ')[1]
        }
        if (a.match('If true')) {
            mo['throwtrue'] = b.split('monkey ')[1]
        }
        if (a.match('If false')) {
            mo['throwfalse'] = b.split('monkey ')[1]
        }
    })
    mo['times'] = 0
    monkeys.push(mo)
})

let monkeys2 = utils.clone(monkeys)

// Part 1
for (let i = 0; i<20; i++) {
    monkeys.forEach( (m, j) => {
        m.items.forEach( w => {
            let old = +w
            let n = eval(m.op)
            n = Math.floor(n/3)
            if (n%m.test ==0) {
                monkeys[m.throwtrue].items.push(n)
            } else {
                monkeys[m.throwfalse].items.push(n)
            }
            m.times++
        })
        m.items = []
    })
}
let s = utils.sort(monkeys, 'times', false).slice(0, 2)

console.log(utils.prod(s, 'times'))

utils.took('part 1');

let product_tests = monkeys2.reduce((acc, x) => (acc * parseInt(x.test)), 1)

// Part 2
for (let i = 0; i<10000; i++) {
    monkeys2.forEach( (m, j) => {
        m.items.forEach( w => {
            let old = +w
            let n = eval(m.op) % product_tests
            // n = Math.floor(n/3)
            if (n%m.test ==0) {
                monkeys2[m.throwtrue].items.push(n)
            } else {
                monkeys2[m.throwfalse].items.push(n)
            }
            m.times++
        })
        m.items = []
    })
}

r = utils.prod(
    utils.sort(monkeys2, 'times', false).slice(0, 2),
    'times'
)

console.log(r)
utils.took('part 2')
// utils.assert(r, 14952185856)
