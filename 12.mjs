import * as U from './helpers/utils.js'
import {min} from "mathjs";
import {search2Darray} from "./helpers/utils.js";
// import { lcm, gcd } from 'mathjs'
const input = (await U.readFile('input/12-1.txt')).split('\n').slice(0,-1)
// ---------------------------------------------

let a,b,c,d
let r

let elev = input.map(x => x.split(''))

// locate 'S'
let [sx, sy] = search2Darray(elev, 'S')

elev[sx][sy] = 'a'
let stepMap = U.range(elev.length).map(x => U.range(elev[0].length).fill(1000))
let rc = elev.length
let cc = elev[0].length
let [ex, ey] = [0, 0]

function elevDiffOK(actual, [i, j], steps) {
    if (i<0 || j<0 || i>=rc || j>=cc)
        return 0

    if (steps >= stepMap[i][j])
        return 0

    let code1 = (elev[i][j]+'').charCodeAt(0)
    if (code1 == 69) {
        [ex, ey] = [i, j]
        code1 = 122
    } // E for z}
    let code2 = (actual+'').charCodeAt(0)
    if ((code1 - code2) <= 1) {
        stepMap[i][j] = steps
        return 1
    }
    return 0
}


function explore(steps, [i, j]) {
    let letter = elev[i][j]

    if (elevDiffOK(letter, [i, j+1], steps)) {
        explore(steps+1, [i, j+1])
    }
    if (elevDiffOK(letter, [i, j-1], steps)) {
        explore(steps+1, [i, j-1])
    }
    if (elevDiffOK(letter, [i+1, j], steps)) {
        explore(steps+1, [i+1, j])
    }
    if (elevDiffOK(letter, [i-1, j], steps)) {
        explore(steps+1, [i-1, j])
    }
    // console.log('steps', steps)
    // return steps
}

explore(1, [sx, sy])

console.log('Part 1', stepMap[ex][ey])
U.took('part 1')

// Part 2
let minSteps = 1000

for (let [e, line] of elev.entries()) {
    for (let [f, ltr] of line.entries()) {
        if (ltr == 'a') {
            explore(1, [e, f])
            if (stepMap[ex][ey] < minSteps) {
                minSteps = stepMap[ex][ey]
            }
        }
    }
}

console.log('Part 2', minSteps)
U.took('part 2')