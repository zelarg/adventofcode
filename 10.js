const {readFile, sumAll} = require('./helpers/init')
const input = readFile('input/10-1.txt').split('\n').slice(0, -1)
// ---------------------------------------------

let x = 1
let c = 0
let strengths = []
let screen = []

const tick = () => {
    let pixel = c%40-1
    const draw = Math.abs(x-pixel) <= 1
    screen.push({c: c-1, s: (draw)?'#':'.'})
    strengths.push({c, s: c * x})
}

input.forEach(line => {
    [cmd, a] = line.split(' ')
    c++
    tick()
    if (cmd == 'addx') {
        c++
        tick()
        x += +a
    }
})
let res = strengths.filter(x => x.c%40 == 20)
console.log('Part 1', res.reduce((acc,x) => acc+x.s, 0))

// console.log(screen)
let res2 = screen.map(x => {
    return ((x.c)%40==0 ? '\n' : '') + x.s
}).join('')
console.log('Part 2', res2)