import * as U from './helpers/utils.js'
// import { lcm, gcd } from 'mathjs'
// import Deque from "double-ended-queue";
const input = (await U.readFile('input/22-1.txt')).split('\n\n')
// ---------------------------------------------

let inputLines = input[0].split('\n')
let rows = inputLines.length
let cols = 0
inputLines.forEach( (line, i) => {
    cols = Math.max(cols, line.length)
})

let M = U.range(0,rows).map(x=>U.range(0,cols).fill(' '))

let myx = 0
let myy = 0
// Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^)
let facing = 0
let startx

let path = input[1].match(/(\d+|L|R)/g)

export const mod = (a, b) => ((a % b) + b) % b;

input[0].split('\n').forEach( (line, i) => {
    for (let j = 0; j<line.length; j++) {
        M[i][j] = line[j]
    }
})

// find starting '.'
for (let [i, ltr] of M[0].entries()) {
    if (ltr == '.') {
        startx = i
        break
    }
}
myx = startx

path.forEach(p=>{
    if (p == 'L') {
        facing = mod(facing-1,4)
    }
    else if (p == 'R') {
        facing = mod(facing+1, 4)
    } else {
        let steps = +p
        let s = 0

        let [newx, newy] = [myx, myy]

        while (s < steps) {
            if (facing == 0) {
                newx++
                newx = mod(newx, cols)
                if (M[myy][newx] == '#') break
                if (M[myy][newx] == '.') {
                    s++;
                    myx = newx
                }
            }
            if (facing == 2) {
                newx--
                newx = mod(newx, cols)
                if (M[myy][newx] == '#') break
                if (M[myy][newx] == '.') {
                    s++
                    myx = newx
                }
            }
            if (facing == 1) {
                newy++
                newy = mod(newy, rows)
                if (M[newy][myx] == '#') break
                if (M[newy][myx] == '.') {
                    s++
                    myy = newy
                }
            }
            if (facing == 3) {
                newy--
                newy = mod(newy, rows)
                if (M[newy][myx] == '#') break
                if (M[newy][myx] == '.') {
                    s++
                    myy = newy
                }
            }
        }
    }
})

console.log('Part 1', 1000*(myy+1)+4*(myx+1)+facing)
U.took('part 1')

// Part2 ------------------------------

myx = startx
myy = 0
facing = 0

M = U.range(0,rows).map(x=>U.range(0,cols).fill(' '))

// last param is cube's face orientation from 0 = top, clockwise
// let facesConfig = [
//     [1,3, 'TOP', 0],
//     [2,1, 'BACK', 0],
//     [2,2, 'LEFT', 0],
//     [2,3, 'FRONT', 0],
//     [3,3, 'BOTTOM', 0],
//     [3,4, 'RIGHT', 1],
// ]
// let cubesize = 4

let facesConfig = [
    [1,2, 'TOP', 0],
    [1,3, 'RIGHT', 3],
    [2,2, 'FRONT', 0],
    [3,1, 'LEFT', 3],
    [3,2, 'BOTTOM', 0],
    [4,1, 'BACK', 3],
]
let cubesize = 50

let facesDirections = {
    TOP: ['RIGHT', 'FRONT', 'LEFT', 'BACK'],
    FRONT: ['RIGHT', 'BOTTOM', 'LEFT', 'TOP'],
    BOTTOM: ['RIGHT', 'BACK', 'LEFT', 'FRONT'],
    LEFT: ['FRONT', 'BOTTOM', 'BACK', 'TOP'],
    RIGHT: ['BACK', 'BOTTOM', 'FRONT', 'TOP'],
    BACK: ['LEFT', 'BOTTOM', 'RIGHT', 'TOP'],
}

input[0].split('\n').forEach( (line, i) => {
    for (let j = 0; j<line.length; j++) {
        let cube1 = Math.ceil((i+0.1) / cubesize)
        let cube2 = Math.ceil((j+0.1) / cubesize)
        let face = facesConfig.filter(([x,y]) =>{ return (x==cube1 && y==cube2) })
        let faceName = (face.length) ? `${face[0][2]}-${face[0][3]}` : '-'
        if (face.length && face[0].length < 5) {
            face[0][4] = [i,j] // top-left position of every face in our 2D map
        }
        M[i][j] = [line[j], faceName]
    }
})

let prevFace = 'TOP'

function switchFace(facing, faceOrientation, myface) {
    let [newx, newy] = [0, 0]
    let emitFromSourceAtWithOrientation = mod(facing-faceOrientation, 4)
    let emitFromSourceAt = mod(facing, 4)
    let targetFace = facesDirections[myface][emitFromSourceAtWithOrientation]
    let attachmentAtTarget = facesDirections[targetFace].indexOf(myface)

    let target = facesConfig.find(([,,f,pos]) =>{ return (f==targetFace) })
    let [targety, targetx, targetOrientation] = [...target[4], target[3]]

    let newFacing = mod((attachmentAtTarget+targetOrientation)+2, 4)

    // position inside actual face
    let source = facesConfig.find(([,,f,pos]) =>{ return (f==myface) })
    let [sourcey, sourcex] = [...source[4]]
    let facex = myx - sourcex
    let facey = myy - sourcey


    if (newFacing == 0) {
        newx = targetx
        if (emitFromSourceAt == 1) {
            newy = targety - 1 + (cubesize - facex)
        } else if (emitFromSourceAt == 3) {
            newy = targety + facex
        } else if (emitFromSourceAt == 2) {
            // newy = (cubesize - 1 - facey)
            newy = targety + (cubesize - 1 - facey)
        } else {
            newy = targety+facey
        }
    }

    if (newFacing == 2) {
        newx = targetx + (cubesize - 1)
        if (emitFromSourceAt == 1) {
            newy = targety + facex
        } else if (emitFromSourceAt == 3) {
            newy = targety - 1 + (cubesize - facex)
        } else if (emitFromSourceAt == 2) {
            newy = targety+facey
        } else {
            newy = targety + (cubesize - 1 - facey)
        }
    }

    if (newFacing == 1) {
        newy = targety
        if (emitFromSourceAt == 0) {
            newx = targetx - 1 + (cubesize - facey)
        } else if (emitFromSourceAt == 2) {
            newx = targetx + facey
        } else if (emitFromSourceAt == 1) {
            newx = targetx+facex
        } else {
            newx = targetx + (cubesize - 1 - facex)
        }
    }

    if (newFacing == 3) {
        newy = targety + (cubesize-1)
        if (emitFromSourceAt == 0) {
            newx = targetx + facey
        } else if (emitFromSourceAt == 2) {
            newx = targetx - 1 + (cubesize - facey)
        } else if (emitFromSourceAt == 1) {
            newx = targetx + (cubesize - 1 - facex)
        } else {
            newx = targetx+facex
        }
    }
    changedFacing += (facing - newFacing)
    // console.log(` === stepped into void from ${myface}-${faceOrientation} at [${myy+1},${myx+1}], new face: ${targetFace}, try-new coordinates ${newy+1},${newx+1},${newFacing}`)
    return [newx, newy, newFacing, targetx, targety]
}

let iit = 0
let changedL = 0
let changedR = 0
let changedFacing = 0
forloop:
for (let it = 0; it<path.length; it++) {
    let p = path[it]
    if (p == 'L') {
        changedL++
        facing = mod(facing-1,4)
        // console.log('turning L at', myy, myx)
    }
    else if (p == 'R') {
        changedR++
        facing = mod(facing+1, 4)
        // console.log('turning R at', myy, myx)
    } else {
        // console.log('- after turn, my position', myy, myx, 'steps to take:', +p, 'direction: ', facing)
        let steps = +p
        let s = 0

        let [newx, newy, newFacing] = [myx, myy, facing]
        let [myface, faceOrientation] = M[newy][newx][1].split('-')

        while (s < steps) {
            iit++
            // if (iit++ > 2000) break forloop
            if (facing == 0) {
                newx++
                if (newx >= cols || newx < 0 || M[newy][newx][0] == ' ') {
                    ;[newx, newy, newFacing] = switchFace(facing, faceOrientation, myface)
                }
                if (newx < cols && newx >= 0 && M[newy][newx][0] == '#') break
                if (newx < cols && newx >= 0 && M[newy][newx][0] == '.') {
                    s++;
                    ;[myx,myy,facing] = [newx,newy,newFacing]
                    ;[myface, faceOrientation] = M[newy][newx][1].split('-')
                    if (myface != prevFace) {
                        prevFace = myface
                    }
                }
            }
            else if (facing == 2) {
                newx--
                if (newx >= cols || newx < 0 || M[newy][newx][0] == ' ') {
                    ;[newx, newy, newFacing] = switchFace(facing, faceOrientation, myface)
                }
                if (M[newy][newx][0] == '#') break
                if (M[newy][newx][0] == '.') {
                    s++
                    ;[myx,myy,facing] = [newx,newy,newFacing]
                    ;[myface, faceOrientation] = M[newy][newx][1].split('-')
                    if (myface != prevFace) {
                        prevFace = myface
                    }
                }
            }
            else if (facing == 1) {
                newy++
                if (newy >= rows || newy < 0 || M[newy][newx][0] == ' ') {
                    ;[newx, newy, newFacing] = switchFace(facing, faceOrientation, myface)
                }

                if (M[newy][newx][0] == '#') break
                if (M[newy][newx][0] == '.') {
                    s++
                    ;[myx,myy,facing] = [newx,newy,newFacing]
                    ;[myface, faceOrientation] = M[newy][newx][1].split('-')
                    if (myface != prevFace) {
                        prevFace = myface
                    }
                }
            }
            else if (facing == 3) {
                newy--
                if (newy >= rows || newy < 0 || M[newy][newx][0] == ' ') {
                    ;[newx, newy, newFacing] = switchFace(facing, faceOrientation, myface)
                }
                if (M[newy][newx][0] == '#') break
                if (M[newy][newx][0] == '.') {
                    s++
                    ;[myx,myy,facing] = [newx,newy,newFacing]
                    ;[myface, faceOrientation] = M[newy][newx][1].split('-')
                    if (myface != prevFace) {
                        prevFace = myface
                    }
                }
            }
            // console.log(`[${pi}] step ${s}, recorded pos: [${myy},${myx}], new pos: [${newy},${newx}], remaining steps ${steps-s}`)
        }
    }
}

console.log('Part 2', 1000*(myy+1)+4*(myx+1)+facing)
U.took('part 2')

// Part 1 117054
// -- [part 1] took 7.61 ms --
// Part 2 162096
// -- [part 2] took 24.21 ms --