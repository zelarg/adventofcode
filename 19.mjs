import * as U from './helpers/utils.js'
import {exp} from "mathjs";
// import { lcm, gcd } from 'mathjs'
const input = (await U.readFile('input/19-1.txt')).split('\n').slice(0,-1)
// ---------------------------------------------

let a,b,c,d
let blueprints = []
input.forEach( (line, i) => {
    let [id, oreOre, clayOre, obsOre, obsClay, geoOre, geoObs] = line.match(/(\d+)/g)
    blueprints.push({id, ore: { ore: +oreOre }, clay: { ore: +clayOre }, obs: { ore: +obsOre, clay: +obsClay }, geo: { ore: +geoOre, obs: +geoObs }})
})

let robots = [1, 0, 0, 0]
let res = [0, 0, 0, 0]

let optionsToExplore = []
let explored = new Map()

let maxGeo = 0
let exploreReps = 0
let cachedReps = 0

function explore(blueprint, startingOptions, MINUTES) {
    let {ore, clay, obs, geo} = blueprint
    let maxOreRobots = Math.max(ore.ore, clay.ore, obs.ore, geo.ore)
    let maxClayRobots = Math.max(obs.clay)
    let maxObsRobots = Math.max(geo.obs)

    maxGeo = 0
    exploreReps = 0
    cachedReps = 0
    let maxGeoAtMinute = U.range(0, 32).fill(0)
    optionsToExplore = [startingOptions]
    explored = new Map()

    while (optionsToExplore.length) {
        let [minute, robOre, robClay, robObs, robGeo, resOre, resClay, resObs, resGeo] = optionsToExplore.pop()

        let key = [minute, robOre, robClay, robObs, robGeo, resOre, resClay, resObs, resGeo].join(',')
        if (explored.has(key)) {
            cachedReps++;
            continue
        }

        maxGeoAtMinute[minute] = Math.max(maxGeoAtMinute[minute], resGeo)
        // return early, if this branch is not perspective
        let compareBackMinutes = 0
        if (minute > compareBackMinutes && resGeo < maxGeoAtMinute[minute-compareBackMinutes]) {
            continue
        }

        // optimization
        let remainingTime = MINUTES - minute


        exploreReps++
        explored.set(key, resGeo)

        let canBuildGeo =  (resOre >= geo.ore && resObs >= geo.obs)
        let canBuildObs =  (resOre >= obs.ore && resClay >= obs.clay && robObs < maxObsRobots)
        let canBuildClay = (resOre >= clay.ore && robClay < maxClayRobots)
        let canBuildOre =  (resOre >= ore.ore && robOre < maxOreRobots)

        // harvest
        resGeo += robGeo
        resObs += robObs
        resClay += robClay
        resOre += robOre

        minute++
        if (minute == MINUTES) {
            maxGeo = Math.max(maxGeo, resGeo)
            continue
        }

        // new key with increased minute
        key = [minute, robOre, robClay, robObs, robGeo, resOre, resClay, resObs, resGeo].join(',')
        optionsToExplore.push([minute, robOre, robClay, robObs, robGeo, resOre, resClay, resObs, resGeo, 'no-build'])

        if (canBuildGeo) {
            let keyArr = [
                minute,
                robOre, robClay, robObs, robGeo + 1,
                resOre - geo.ore, resClay, resObs - geo.obs, resGeo,
            ]
            // if (!explored.has(keyArr.join(',')))
                optionsToExplore.push([...keyArr, 'buildGeo'])
        }
        if (canBuildObs) {
            let keyArr = [
                minute,
                robOre, robClay, robObs+1, robGeo,
                resOre - obs.ore, resClay-obs.clay, resObs, resGeo,
            ]
            // if (!explored.has(keyArr.join(',')))
                optionsToExplore.push([...keyArr, 'buildObs'])
        }
        if (canBuildClay) {
            let keyArr = [
                minute,
                robOre, robClay+1, robObs, robGeo,
                resOre - clay.ore, resClay, resObs, resGeo,
            ]
            // if (!explored.has(keyArr.join(',')))
                optionsToExplore.push([...keyArr, 'buildClay'])
        }
        if (canBuildOre) {
            let keyArr = [
                minute,
                robOre+1, robClay, robObs, robGeo,
                resOre - ore.ore, resClay, resObs, resGeo,
            ]
            // if (!explored.has(keyArr.join(',')))
                optionsToExplore.push([...keyArr, 'buildOre'])
        }

    }
}

// part 1
let totalQuality = 0
for (let [i, blueprint] of blueprints.entries()) {
    explore(blueprint, [0, ...robots, ...res], 24)
    // console.log('- Blueprint ', i, 'reps', exploreReps, 'cached', cachedReps, 'maxGeo', maxGeo)
    totalQuality += maxGeo * blueprint.id
}
console.log('Part 1', totalQuality)
U.took('part 1')

let max3prod = 1
for (let [i, blueprint] of blueprints.entries()) {
    explore(blueprint, [0, ...robots, ...res], 32)
    // explore(blueprint, [4, 1, 1, 0, 0, 2, 1, 0, 0])
    // explore(blueprint, [8, 1, 3, 0, 0, 2, 9, 0, 0])
    // explore(blueprint, [12, 1, 3, 1, 0, 3, 7, 1, 0])
    // explore(blueprint, [14, 1, 4, 1, 0, 3, 15, 3, 0])
    // console.log('- Blueprint ', i, 'reps', exploreReps, 'cached', cachedReps, 'maxGeo', maxGeo)
    max3prod *= maxGeo
    if (i == 2) break
}

console.log('Part 2', max3prod)
U.took('part 2')

// Part 1 1147
// -- [part 1] took 19874.32 ms --
// Part 2 3080
// -- [part 2] took 8563.46 ms --