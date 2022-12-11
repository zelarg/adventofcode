const { readFile, sumAll } = require('./helpers/utils')
const input = readFile('input/04-1.txt').split('\n').slice(0, -1)
// ---------------------------------------------

let r = input.filter(x=> {
    let [[a,b],[c,d]] = x.split(',').map(x=>(x.split('-')))
    return (a-c)*(b-d)<=0
})
console.log(r.length)

r = input.filter(x=> {
    let [[a,b],[c,d]] = x.split(',').map(x=>(x.split('-')))
    return (b-c)*(a-d)<=0
})
console.log(r.length)