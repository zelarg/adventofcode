import * as U from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
const input = (await U.readFile('input/16-1.txt')).split('\n').slice(0,-1)
// ---------------------------------------------


let Vo = []

input.forEach( (line, i) => {
    let [,valve, rate, tunnels] = line.match(/Valve ([A-Z]+).*? rate=(\d+);.*? to valve.? (.*)/)
    Vo[valve] = [ rate, tunnels.split(', ').map(x=>(x+'-1')), false ]
})

// simplify V
let V = U.clone(Vo)
for (const [key, value] of Object.entries(V)) {
    if (+value[0] == 0 && value[1].length == 2) {
        // console.log(key, value)
        // replace 'key' with value[0] or [1] in sibling nodes
        let [p1, d1] = value[1][0].split('-')
        let [p2, d2] = value[1][1].split('-')
        let target1 = V[p1]
        let target2 = V[p2]

        for (let k = 0; k<target1[1].length; k++) {
            if (target1[1][k].startsWith(key)) {
                let [v, d] = target1[1][k].split('-')
                target1[1][k] = p2 + '-' + (+d + +d2)
            }
        }
        for (let k = 0; k<target2[1].length; k++) {
            if (target2[1][k].startsWith(key)) {
                let [v, d] = target2[1][k].split('-')
                target2[1][k] = p1 + '-' + (+d+ +d1)
            }
        }
        delete V[key]
    }
}

function countPressure(openedValves) {
    let pr = 0
    for (let [i, room] of openedValves.entries()) {
        pr+=+V[room][0]
    }
    return pr
}

let totalValves = 0
for (const [key, value] of Object.entries(V)) {
    if (+value[0] > 0) totalValves++
}

let recursiveCalls = 0

let globalMaxPressures = U.range(0, 31).fill(0)
let t = ''
let maxReportedPressure = 0

function processRoom(room, minute, pressure, openedValves, path) {
    recursiveCalls++
    let options = [0]
    let incPressure = countPressure(openedValves)
    pressure += incPressure
    options.push(pressure)
    if (pressure > globalMaxPressures[minute])
        globalMaxPressures[minute] = pressure

    // return early, if this branch is not perspective
    let compareBackMinutes = 1
    if (minute > compareBackMinutes && pressure < globalMaxPressures[minute-compareBackMinutes]) {
        return pressure
    }

    const untilMinute = 30

    if (openedValves.length == totalValves) {
        return pressure + (untilMinute - minute) * incPressure
    }

    if (minute < untilMinute) {
        // open valve
        let newValves = []
        if (+V[room][0]>0 && !openedValves.includes(room)) {
            let p1 = processRoom(room, minute+1, pressure, [ ...openedValves, room ], path + '#')
            options.push(p1)
        }

        for (let [i, nextRoom] of V[room][1].entries()) {
            let [nextRoomName, distance] = nextRoom.split('-')

            distance = Math.min(+distance, (untilMinute - minute))
            let p2 = processRoom(nextRoomName, minute+(distance), pressure + (distance-1)*incPressure, openedValves, path + '>' + nextRoomName)
            options.push(p2)
        }
        return Math.max(...options)
    } else {
        if (pressure > maxReportedPressure) {
            maxReportedPressure = pressure
            console.log('At 30 min mark, max pressure: ', pressure, minute, path)
        }
        return pressure
    }
}

let maxPressure = processRoom('AA', 1, 0, [], '')
// let maxPressure = processRoom('JJ', 9, 159, ['BB','DD'], 'Minute9:JJ')
// let maxPressure = processRoom('HH', 17, 570, ['BB','DD','JJ'], 'Minute17:HH')
// let maxPressure = processRoom('HH', 18, 624, ['BB','DD','JJ','HH'], 'Minute18:HH')
// let maxPressure = processRoom('HH', 18, 624, ['BB','DD','JJ','HH'], 'Minute18:HH')
// let maxPressure = processRoom('FF', 20, 776, ['BB','DD', 'HH', 'JJ'], 'Minute20:FF')
// let maxPressure = processRoom('EE', 21, 852, ['BB','DD', 'HH', 'JJ'], 'Minute21:EE')

// console.log('global pressures at minutes')
// console.table(globalMaxPressures)
console.log('recursive calls', recursiveCalls)
console.log('Part 1:', maxPressure)
U.took('part 1')

// recursive calls 54146
// Part 1: 1580
// -- [part 1] took 50.52 ms --