import * as U from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
const input = (await U.readFile('input/17-1.txt')).split('\n').slice(0,-1)
// ---------------------------------------------

let jets = input[0].split('').map(x=> (x=='<')?0:1)
let jetsLength = jets.length

let shapes = [
    [
        [1,1,1,1]
    ],
    [
        [0,1,0],
        [1,1,1],
        [0,1,0],
    ],
    [
        [0,0,1],
        [0,0,1],
        [1,1,1],
    ],
    [
        [1],
        [1],
        [1],
        [1],
    ],
    [
        [1,1],
        [1,1],
    ],
]

function addShapeToBuild(x, y, shape) {
    // console.log('add shape to build', x, y, shape)
    for (let i=0; i<shape.length; i++) {
        for (let j=0; j<shape[0].length; j++) {
            chamber[y+i][x+j] += shape[shape.length-1-i][j]
        }
    }
}

function detectCollision(arr1, arr2, atx, aty) {
    for (let y = 0; y < arr2.length; y++) {
        for (let x = 0; x < arr2[0].length; x++) {
            if (arr1[y+aty][x+atx] && arr2[arr2.length-1-y][x]) return 1
        }
    }
    return 0
}

function down(x, y, shape) {
    if (y==0) return 0
    if (detectCollision(chamber, shape, x, y-1))
            return 0

    return 1
}

function leftRight(x, y, shape, direction) {
    if (x==0 && direction == 0) return 0
    let shapeWidth = shape[0].length
    if (shapeWidth+x == 7 && direction == 1) return 0

    if (direction == 0) {
        if (detectCollision(chamber, shape, x-1, y)) {
            return 0
        }
    } else {
        if (detectCollision(chamber, shape, x+1, y)) {
            return 0
        }
    }

    return (direction == 0) ? -1 : 1
}

function rowsHash(rows) {
    let hash = ''
    for (let j = 0; j < rows.length; j++) {
        let bin = ''
        for (let i = 0; i < rows[j].length; i++) {
            bin += rows[j][i]
        }
        hash += String.fromCharCode(parseInt(bin, 2)+30)
    }
    return hash
}

let chamberBuffer = U.range(0,10_000).map(x=>U.range(0,7).fill(0))
let chamber = U.clone(chamberBuffer)
let buildHeight = 0
let shapeRow = 3 // from the bottom
let shapeCol = 2
let iteration = 0
let shapeCount = 0
let shape = shapes[0]
let firstCheckIter = 0
let firstCheckShape = 0
let hashes = new Set()
let lastrepetitionat = 0
let lastShaperepetitionat = 0
let checkPatternSize = 100
let MAX = 1_000_000_000_000
let buildHeightExtra = 0
// let MAX = 2022
while (shapeCount < MAX) {

    let direction = jets[iteration%jetsLength]

    shapeCol += leftRight(shapeCol, shapeRow, shape, direction)

    if (!down(shapeCol, shapeRow, shape)) {
        addShapeToBuild(shapeCol, shapeRow, shape)

        buildHeight = Math.max(shapeRow + shape.length, buildHeight)
        shapeRow = buildHeight + 3

        if (shapeRow+5 > chamber.length) {
            chamber = chamber.concat(U.clone(chamberBuffer))
        }

        if (buildHeight > checkPatternSize + 7 && firstCheckIter == 0) {
            firstCheckIter = iteration%jetsLength
            firstCheckShape = shapeCount%5
        }

        if (firstCheckIter > 0 && firstCheckShape == shapeCount%5) {
            // calculate hash of few top rows
            let hh = rowsHash(chamber.slice(buildHeight-(checkPatternSize + 7), buildHeight-7))
            if (hashes.has(hh)) {
                // let patternEveryNShapes = shapeCount-lastShaperepetitionat
                // console.log('pattern found! @ShapeCount=', shapeCount, patternEveryNShapes)
                if (lastrepetitionat > 0 && buildHeightExtra == 0) {
                    let patternEveryNShapes = shapeCount-lastShaperepetitionat
                    let patternEveryNHeight = buildHeight-lastrepetitionat
                    console.log(`repeating pattern detected every ${patternEveryNShapes} shapes = every ${patternEveryNHeight} buildHeight`)
                    let patternRepsTillEnd = Math.floor((MAX - shapeCount) / patternEveryNShapes)
                    MAX = MAX - patternRepsTillEnd * patternEveryNShapes
                    buildHeightExtra = patternEveryNHeight * patternRepsTillEnd
                }
                hashes.clear()
                lastrepetitionat = buildHeight
                lastShaperepetitionat = shapeCount
            }
            hashes.add(hh)
        }

        shapeCol = 2
        // new shape
        shapeCount++
        // if (shapeCount == 2022) {
        //     console.log('Part 1', buildHeight)
        //     U.took('part 1')
        // }
        shape = shapes[shapeCount%5]
    } else {
        shapeRow--
    }

    iteration++
}


// console.table(chamber.slice(0,20).reverse().map(x=> x.map( y => (y==0)?'.':'#').join(' ') ))

console.log('Part 2 Total build height', buildHeightExtra + buildHeight, ', iterations', iteration)
U.took('part 2')

// Build height 3197 iterations 11746
// -- [part 1] took 14 ms --

// repeating pattern detected every 1715 shapes = every 2690 buildHeight
// Part 2 Total build height 1568513119571 , iterations 30214
// -- [part 2] took 52.23 ms --