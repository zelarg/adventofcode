const { readFile, sumAll } = require('./helpers/utils')
const input = readFile('input/05-1.txt').split('\n\n')
// ---------------------------------------------
let r1 = input[0].split('\n').map(x=>{
    return x.match(/.{1,4}/g)
})

const simulate = (is9001) => {
    let stacks = r1[0].map((_, colIndex) => r1.map(row => row[colIndex])).map(x=>x.filter(y=>(y.match(/[A-Z]/))))

    input[1].split('\n').slice(0, -1).map(x => {
        [qty, from, to] = x.match(/\d+/g)
        took = stacks[from-1].splice(0, qty)
        stacks[to-1].unshift(...(is9001) ? took : took.reverse())
    })

    console.log(stacks.reduce((acc, x)=>(acc + x[0].match(/[A-Z]/g)), ''))
}

simulate(false)
simulate(true)
