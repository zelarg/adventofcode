import * as U from './helpers/utils.js'
import Deque from "double-ended-queue"
const input = (await U.readFile('input/24-1.txt')).split('\n').slice(0,-1)
// ---------------------------------------------

let rc = input.length - 2
let cc = input[0].length - 2

let horizontal = U.range(0,rc).map(x=>[])
let vertical = U.range(0,cc).map(x=>[])

for (let [i, line] of input.entries()) {
    if (i==0 || i==rc+1) continue

    for (let [j, x] of line.slice(1, -1).split('').entries()) {
        if (x=='<') horizontal[i-1].push([j,-1])
        if (x=='>') horizontal[i-1].push([j,1])
        if (x=='^') vertical[j].push([i-1,-1])
        if (x=='v') vertical[j].push([i-1,1])
    }
}

let B = new Map()

function blizzardsAt(minute) {
    if (B.has(minute)) {
        return B.get(minute)
    }
    let arr= U.range(0,rc).map(x=>U.range(0,cc).fill(0))

    for (let yy = 0; yy < rc; yy++) {
        for (let [b, dir] of horizontal[yy]) {
            let bpos = U.mod(b + minute * dir, cc)
            arr[yy][bpos] = 1
        }
    }
    for (let xx = 0; xx < cc; xx++) {
        for (let [b, dir] of vertical[xx]) {
            let bpos = U.mod(b + minute * dir, rc)
            arr[bpos][xx] = 1
        }
    }
    B.set(minute, arr)
    return arr
}

function nextOptions(minute, y, x) {
    if (y == -1) return [[0, 0], [1, 0]]
    if (y == rc) return [[0, 0], [-1, 0]]

    let blizzards = blizzardsAt(minute)
    let next = []
    if (!blizzards[y][x]) next.push([0,0])
    if (y > 0 && !blizzards[y-1][x]) next.push([-1,0])
    if (y < rc-1 && !blizzards[y+1][x]) next.push([1,0])
    if (x > 0 && !blizzards[y][x-1]) next.push([0,-1])
    if (x < cc-1 && !blizzards[y][x+1]) next.push([0,1])

    return next
}

function goFromTo(minute, myy, myx, targety, targetx) {
    let seen = new Set()
    let options = new Deque()
    options.push([minute, myy, myx])

    let targetReachedIn = 1000

    while (options.length) {
        let [minute, y, x] = options.shift()

        let key = `${minute}-${y}-${x}`
        if (seen.has(key)) {
            continue
        }
        seen.add(key)

        if (minute >= targetReachedIn) {
            break
        }

        if (y == targety && x == targetx) {
            targetReachedIn = Math.min(targetReachedIn, minute)
            break
        }

        for (let [opy, opx] of nextOptions(minute+1,y,x)) {
            options.push([minute + 1, y + opy, x + opx])
        }
    }
    return targetReachedIn
}

let reachedIn = goFromTo(0,-1, 0, rc-1, cc-1)

console.log('Part 1:', reachedIn+1)
U.took('part 1')

reachedIn = goFromTo(reachedIn+1, rc, cc-1, 0, 0)
reachedIn = goFromTo(reachedIn+1, -1, 0, rc-1, cc-1)

console.log('Part 2:', reachedIn+1)
U.took('part 2')

// Part 1: 322
// -- [part 1] took 205.27 ms --
// Part 2: 974
// -- [part 2] took 317.75 ms --