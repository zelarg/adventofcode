import * as U from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
const input = (await U.readFile('input/12-1.txt')).split('\n').slice(0,-1)
// ---------------------------------------------

let ord = (str) => (''+str).charCodeAt(0)
let mapEl = input.map( x => x.split('').map(y=>ord(y)) )

let [sx, sy] = U.search2Darray(mapEl, 83) // 'S'
let [ex, ey] = U.search2Darray(mapEl, 69) // 'E'

mapEl[sx][sy] = 97
mapEl[ex][ey] = 122

function canGo(char, x, y) {
    if (x<0 || x>=rc || y<0 || y>=cc) {
        return false
    }
    let can = mapEl[x][y] <= char + 1
    return can
}
let rc = input.length
let cc = input[0].length

let steps = U.range(mapEl.length).map(x => U.range(mapEl[0].length).fill(1000))

steps[sx][sy] = 0

function inspectNode([startx, starty]) {
    let inspect = [[startx, starty]]
    while (inspect.length) {
        let [row, col] = inspect.pop()

        ;[[0,1], [0,-1], [1,0], [-1,0]].forEach(([x, y]) => {
            let can = canGo(mapEl[row][col], row+x, col+y)
            if (can) {
                if (steps[row+x][col+y] > steps[row][col] + 1) {
                    steps[row+x][col+y] = steps[row][col]  + 1
                    inspect.push([row+x,col+y])
                }
            }
        })
    }
}

inspectNode([sx, sy])

console.log('Part 1', steps[ex][ey])
U.took('part 1')

let minSteps = 1000
for (let [e, line] of mapEl.entries()) {
    for (let [f, ltr] of line.entries()) {
        if (ltr == 97) {
            steps[e][f] = 0
            inspectNode([e, f])
            if (steps[ex][ey] < minSteps) {
                minSteps = steps[ex][ey]
            }
        }
    }
}

// console.table(steps)
console.log('Part 2', minSteps)
U.took('part 2')