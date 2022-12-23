import * as U from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
// import Deque from "double-ended-queue";
const input = (await U.readFile('input/23-1.txt')).split('\n').slice(0,-1)
// ---------------------------------------------

let gridsize = input.length * 5
let startingPos = input.length * 2
let G = U.range(0,gridsize).map(x=>U.range(0,gridsize).fill([0,0]))

let dirs = [
    [-1,0,[-1,-1],[-1,1]],
    [1,0,[1,-1],[1,1]],
    [0,-1,[-1,-1],[1,-1]],
    [0,1,[-1,1],[1,1]]
]
let g = 1
input.forEach( (line, i) => {
    let repl = line.replace(/\./g,0).replace(/#/g,1)
    for (let [j, n] of repl.split('').entries()) {
        G[i+startingPos][j+startingPos] = [(+n>0)?g++:0, 0] // 0=starting direction from 'dirs'
    }
})

function checkSurrounding(y, x, round) {
    if (G[y-1][x-1][0] + G[y-1][x][0]  + G[y-1][x+1][0]  + G[y][x-1][0]  +
    G[y][x+1][0]  + G[y+1][x-1][0]  + G[y+1][x][0]  + G[y+1][x+1][0]  == 0) {
        return 0
    }

    let direction = round % 4
    for (let i of U.range(4)) {
        let c = dirs[direction]
        let cy = y + c[0]
        let cx = x + c[1]
        let cy1 = y + c[2][0]
        let cx1 = x + c[2][1]
        let cy2 = y + c[3][0]
        let cx2 = x + c[3][1]
        if (G[cy][cx][0]  + G[cy1][cx1][0]  + G[cy2][cx2][0]  == 0) {
            // can move
            return [cy, cx]
        }
        direction = (direction+1) % 4
    }

    return 0
}

let proposals = new Map()

function processProposals() {
    for (let [target, source] of proposals) {
        if (source == 0) continue
        let [ty, tx] = target.split('-')
        G[ty][tx] = G[source[0]][source[1]]
        G[source[0]][source[1]] = [0,0]
    }

    proposals.clear()
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

let round = 0
while (true) {
    // console.log('round', round+1)
    for (let r=0;r<gridsize;r++) {
        for (let c=0;c<gridsize;c++) {
            if (G[r][c][0] >= 1) {
                let canGo = checkSurrounding(r,c, round)
                if (canGo) {
                    let propKey = `${canGo[0]}-${canGo[1]}`
                    if (proposals.has(propKey)) {
                        proposals.set(propKey, 0)
                    } else {
                        proposals.set(propKey, [r,c])
                    }
                }
            }
        }
    }

    let haveValidProposal = false
    for (let [target, source] of proposals) {
        if (proposals) {
            haveValidProposal = true
            break;
        }
    }
    if (!haveValidProposal) {
        console.log('Part 2:', round+1)
        U.took('part 2')
        break;
    }
    processProposals()
    round++
    // for (let r=0;r<gridsize;r++) {
    //     console.log(G[r].map(x => (x[0] >= 1) ? pad(x[0], 2) : '..').join(''))
    // }

    // Part 1:
    if (round == 10) {
        let [minx, maxx, miny, maxy] = [gridsize,0,gridsize,0]
        for (let r=0;r<gridsize;r++) {
            for (let c = 0; c < gridsize; c++) {
                if (G[r][c][0] >= 1) {
                    minx = Math.min(minx,c)
                    maxx = Math.max(maxx,c)
                    miny = Math.min(miny,r)
                    maxy = Math.max(maxy,r)
                }
            }
        }

        let rect = (maxx - minx + 1) * (maxy - miny + 1)
        console.log('Part 1:', rect - (g-1))
        U.took('part 1')
    }
}

// Part 1: 4241
// -- [part 1] took 51.06 ms --
// Part 2: 1079
// -- [part 2] took 1586.7 ms --

