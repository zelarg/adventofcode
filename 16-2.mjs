import * as U from './helpers/utils.js'
const input = (await U.readFile('input/16-1.txt')).split('\n').slice(0,-1)
// ---------------------------------------------

let Vo = []

input.forEach( (line, i) => {
    let [,valve, rate, tunnels] = line.match(/Valve ([A-Z]+).*? rate=(\d+);.*? to valve.? (.*)/)
    Vo[valve] = [ rate, tunnels.split(', ').map(x=>(x+'-1')), false ]
})

let V = U.clone(Vo)

let SIMPLIFY_PATHS = true

if (SIMPLIFY_PATHS) {
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
}
// console.log(Vo)
// console.log(' ---------- ')
// console.log(V)

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
let maxReportedPressure = 0

let roomCache = new Map()

function processRoom(room1, room2, distance1, distance2, minute, pressure, openedValves, path) {
    // minute = number of minutes when starting room process
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

    const untilMinute = 26

    if (openedValves.length == totalValves) {
        let newPressure = pressure + (untilMinute - minute) * incPressure
        if (newPressure > maxReportedPressure) {
            maxReportedPressure = newPressure
            console.log(`[full-valves] At ${untilMinute} min mark, max pressure: `, newPressure, path)
        }
        return newPressure
    }

    if (minute < untilMinute) {
        let moves1 = []
        let moves2 = []

        // Make decision only when we're not passing through
        if (distance1 == 1) {
            if (+V[room1][0]>0 && !openedValves.includes(room1)) { moves1.push(['valve', '', 1]) }
            for (let [i, nextRoom] of V[room1][1].entries()) {
                let [nextRoomName, distance] = nextRoom.split('-')
                // distance = Math.min(+distance, (untilMinute - minute))
                moves1.push(['go', nextRoomName, distance])
            }
        } else {
            moves1.push(['nothing', room1, distance1-1])
        }

        if (distance2 == 1) {
            if (+V[room2][0]>0 && !openedValves.includes(room2)) { moves2.push(['valve', '', 1]) }
            for (let [i, nextRoom] of V[room2][1].entries()) {
                let [nextRoomName, distance] = nextRoom.split('-')
                // distance = Math.min(+distance, (untilMinute - minute))
                moves2.push(['go', nextRoomName, distance])
            }
        } else {
            moves2.push(['nothing', room2, distance2-1])
        }

        for (let [i, move1] of moves1.entries()) {
            for (let [j, move2] of moves2.entries()) {
                let [action1, param1, distance1] = move1
                let [action2, param2, distance2] = move2
                let newOpenedValves = [...openedValves]
                if (action1 == 'valve')
                    newOpenedValves = [ ...newOpenedValves, room1 ]
                if (action2 == 'valve')
                    newOpenedValves = [ ...newOpenedValves, room2 ]
                newOpenedValves = U.set(newOpenedValves).sort()

                // let's cache processing results to decrease recursion
                let rooms = [(param1 || room1) + '-' + distance1, (param2 || room2)+ '-' + distance2].sort()
                // let processingParams = `${rooms.join('-')}-${minute+1}-${pressure}-${newOpenedValves.sort().join(':')}`
                let processingParams = `${rooms.join(',')}-${minute+1}-${pressure}-${newOpenedValves.sort().join(':')}`
                let p2 = roomCache.get(processingParams)
                if (typeof p2 == 'undefined') {
                    p2 = processRoom(
                        param1 || room1, param2 || room2,
                        distance1,
                        distance2,
                        minute+1,
                        pressure,
                        newOpenedValves,
                        path + '>[' + (param1 || room1) + ':' + (param2 || room2) + ']')
                    if (minute > 1)
                        roomCache.set(processingParams, p2)
                }
                options.push(p2)
            }
        }

        return Math.max(...options)
    } else {
        if (pressure > maxReportedPressure && pressure > 1000) {
            maxReportedPressure = pressure
            console.log(`[time-exceeded] At ${untilMinute} min mark, max pressure: `, pressure, path)
        }
        return pressure
    }
}

let maxPressure = processRoom('AA', 'AA', 1, 1, 1, 0, [], '[AA,AA]:')
// let maxPressure = processRoom('CC', 'GG', 9, 260, ['BB','DD'], 'Minute9:JJ')
// let maxPressure = processRoom('JJ', 'AA', 9, 159, ['BB','DD'], 'Minute9:JJ') // from 9 minute, ignoring elephant's moves
// let maxPressure = processRoom('FF', 'AA', 20, 776, ['BB','DD','HH','JJ'], 'Minute20:FF')
// let maxPressure = processRoom('AA', 'GG', 6, 102, ['DD', 'JJ'], '[AA,GG]:')
// let maxPressure = processRoom('BB', 'HH', 8, 184, ['BB', 'DD', 'HH', 'JJ'], '[BB,HH]:')
// let maxPressure = processRoom('CC', 'FF', 10, 336, ['BB', 'CC', 'DD', 'HH', 'JJ'], '[CC,FF]:')
// let maxPressure = processRoom('CC', 'EE', 11, 414, ['BB', 'CC', 'DD', 'HH', 'JJ'], '[CC,EE]:')
// let maxPressure = processRoom('CC', 'EE', 12, 492, ['BB', 'CC', 'DD', 'EE', 'HH', 'JJ'], '[CC,EE]:')
// let maxPressure = processRoom('JJ', 9, 159, ['BB','DD'], 'Minute9:JJ')
// let maxPressure = processRoom('HH', 17, 570, ['BB','DD','JJ'], 'Minute17:HH')
// let maxPressure = processRoom('HH', 18, 624, ['BB','DD','JJ','HH'], 'Minute18:HH')
// let maxPressure = processRoom('HH', 18, 624, ['BB','DD','JJ','HH'], 'Minute18:HH')
// let maxPressure = processRoom('FF', 20, 776, ['BB','DD', 'HH', 'JJ'], 'Minute20:FF')
// let maxPressure = processRoom('EE', 21, 852, ['BB','DD', 'HH', 'JJ'], 'Minute21:EE')

// console.table(globalMaxPressures)
console.log('recursive calls', recursiveCalls)
// console.log('cache size', roomCache.size)

console.log('Part 2:', maxPressure)
U.took('part 2')


// recursive calls 54_146
// Part 1: 1580
// -- [part 1] took 50.52 ms --

// recursive calls 8_844_475
// Part 2: 2213
// -- [part 2] took 36631.81 ms --