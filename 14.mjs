import * as U from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
const input = (await U.readFile('input/14-1.txt')).split('\n').slice(0,-1)
// ---------------------------------------------

let a,b,c,d
let r

let cave = U.create2Darray(1000,1000)
let maxy = 0

input.forEach( (line, i) => {
    let paths = line.split(' -> ')
    for (let j = 1; j<paths.length; j++) {
        let [fromx, fromy] = paths[j-1].split(',')
        let [tox, toy] = paths[j].split(',')

        ;[fromx, tox] = U.sort([+fromx, +tox])
        ;[fromy, toy] = U.sort([+fromy, +toy])
        if (toy>maxy) maxy = toy

        for (let k=fromx; k<=tox; k++)
            for (let l=fromy; l<=toy; l++)
                cave[k][l] = '#'
    }
})

let cave2 = U.clone(cave) // for part 2
let i = 500
let j = 0
let units = 0
while (j<=maxy+2) {
    // can go down?
    if (cave[i][j+1]) {
        if (!cave[i-1][j+1]) {
            i--; j++;
        } else if (!cave[i+1][j+1])  {
            i++; j++;
        } else {
            cave[i][j] = 'o'
            j=0; i=500; // reset (new sand)
            units++
        }
    } else {
        j++;
    }
}
console.log('Part 1', units)
U.took('part 1')

// ---------- part 2 ------------

i = 500
j = 0
units = 0
for (let k = 0; k<1000; k++) {
    cave2[k][maxy+2] = '#'
}
while (j>0 || i!=500 || !cave2[i][j+1] || !cave2[i-1][j+1] || !cave2[i+1][j+1]) {
    if (cave2[i][j+1]) {
        if (!cave2[i-1][j+1]) {
            i--; j++;
        } else if (!cave2[i+1][j+1])  {
            i++; j++;
        } else {
            cave2[i][j] = 'o'
            j=0; i=500; // reset (new sand)
            units++
        }
    } else {
        j++;
    }
}

console.log('Part 2', units+1)
U.took('part 2')