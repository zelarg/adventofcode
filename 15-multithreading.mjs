import * as U from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
const input = (await U.readFile('input/15-1.txt')).split('\n').slice(0,-1)
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
// ---------------------------------------------

let tr = 2000000

const dst = ([a,b], [c,d]) => { return Math.abs(a-c) + Math.abs(b-d) }

const overlap = (start1, end1, start2, end2) => {
    return Math.max (0, Math.min (end1, end2) - Math.max (start1, start2) + 1)
}

let S = []
let S2 = []
let beaconsAtTr = []
input.forEach( (line, i) => {
    let [s, b] = line.split(':')
    let [, sx, sy] = s.match(/x=(-?\d+).*?y=(-?\d+)/)
    let [, bx, by] = b.match(/x=(-?\d+).*?y=(-?\d+)/)
    if (by == tr || sy == tr) beaconsAtTr.push(bx)
    let sb_dis = dst([sx, sy], [bx, by])
    // console.log('sensor', sx, sy, '-', bx, by, sb_dis)
    let y_dis = sb_dis - Math.abs(sy-tr)
    if (y_dis > 0)
        S.push({sensor: [sx, sy], from: +sx-y_dis, to: +sx+y_dis, range: sb_dis})
    S2.push([+sx, +sy, +sb_dis])
})

let count = 0

// merge overlapping ranges
for (let i = 0; i<S.length; i++){
    // console.log('Ri', R[i])
    for (let j = i+1; j<S.length; j++) {
        if (overlap(S[i].from, S[i].to, S[j].from, S[j].to)) {
            S[j].from = Math.min(S[i].from, S[j].from)
            S[j].to = Math.max(S[i].to, S[j].to)
            S.splice(i, 1)
            i--; break;
        }

    }
}

let sensorsMinus = 0
let beaconsSet = U.set(beaconsAtTr)

S.forEach((x, i)=>{
    count += x.to - x.from + 1
    beaconsSet.forEach(y => {
        if (y >= x.from && y <= x.to) {
            sensorsMinus++
        }
    })
})

console.log('=== Part 1', count - sensorsMinus)
U.took('part 1')

// ------------ part 2 -------------

function processLine(S2, y) {
    let lineRanges = []
    for (let i=0; i<S2.length; i++) {
        [sx, sy, srange] = S2[i]
        linerange = srange - Math.abs(sy - y)
        if (linerange > 0) {
            lineRanges.push([sx-linerange, sx+linerange])
        }
    }
    mergeRanges(lineRanges)
    if (lineRanges.length == 2) {
        if (lineRanges[0][0] > lineRanges[1][1] + 1) {
            resx = lineRanges[1][1] + 1; resy = y; return [lineRanges[1][1] + 1, y]
        }
        if (lineRanges[0][0] < lineRanges[1][1] - 1) {
            resx = lineRanges[1][1] - 1; resy = y; return [lineRanges[1][1] - 1, y]
        }
        if (lineRanges[0][1] > lineRanges[1][0] + 1) {
            resx = lineRanges[1][0] + 1; resy = y; return [lineRanges[1][1] + 1, y]
        }
        if (lineRanges[0][1] < lineRanges[1][0] - 1) {
            resx = lineRanges[1][0] - 1; resy = y; return [lineRanges[1][0] - 1, y]
        }
    }
    return 0
}

const threads = []
const threadCount = 10
for (let i=0; i<threadCount; i++) {
    threads.push(new Worker('./15-worker.mjs', { workerData: { id: i, arr: S2 }}))
}

for (let [i, worker] of threads.entries()) {
    worker.on('message', (msg) => {
        console.log(`Index found! Message from workerId=${i}`, msg);

        [resx, resy] = msg
        if (resx == 'ping') {
            console.log(resy)
            return
        }

        console.log(`=== Part 2 [${resx},${resy}]`, resx * 4_000_000 + resy)
        U.took('part 2')
        process.exit()
    });
}


let sx, sy, srange, linerange
let resx, resy
// for every line only
let M = 4_000_000
let pl = 0
let range = 100_000
let t = 0
for (let y=0; y<=M; y+=range) {
    // console.log('sending data to thread', threadId)
    threads[t++%threadCount].postMessage([y, range])

}

// === Part 1 5525990
// -- [part 1] took 2.46 ms --
// Index found! Message from workerId=6 [ 2939043, 2628223 ]
//     === Part 2 [2939043,2628223] 11756174628223
// -- [part 2] took 176.67 ms --