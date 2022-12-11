const { readFile, sumAll } = require('./helpers/utils')
const input = readFile('input/03-1.txt').split('\n').slice(0, -1)
// ---------------------------------------------

let r = input.map(x=> {
    let a = x.slice(0, x.length/2)
    let b = x.slice(x.length/2)
    let c = a.match(`[${b}]`)[0].charCodeAt(0)
    return c - ((c >= 97)?96:38)
})
console.log(sumAll(r))

r = input.reduce((acc, x, i) => ( ((i % 3 == 0) ? acc.push([x]) : acc[acc.length - 1].push(x)) && acc ), [])
r = r.map( x=> {
    let ab = x[1].match(new RegExp(`[${x[0]}]`,'g')).join('')
    let c = x[2].match(new RegExp(`[${ab}]`), 'g').join().charCodeAt(0)
    return c - ((c >= 97)?96:38)
} )
console.log(sumAll(r))