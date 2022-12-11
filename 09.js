const {readFile, sumAll} = require('./helpers/utils')
const input = readFile('input/09-1.txt').split('\n').slice(0, -1)
// ---------------------------------------------

let [hpos, tpos] = [[{hx: 0, hy: 0}], []]
let [tx, ty, hx, hy] = [0,0,0,0]
input.forEach(x=>{
    [dir, steps] = x.split(' ')
    while (steps > 0) {
        if (dir == 'R') hx++
        if (dir == 'L') hx--
        if (dir == 'U') hy++
        if (dir == 'D') hy--
        hpos.push({hx, hy})
        // calc tpos based on hpos
        if (hx>tx+1) {
            tx++
            if (ty!=hy) ty=ty+((ty<hy)?1:-1)
        }
        if (hx<tx-1) {
            tx--
            if (ty!=hy) ty=ty+((ty<hy)?1:-1)
        }
        if (hy>ty+1) {
            ty++
            if (tx!=hx) tx=tx+((tx<hx)?1:-1)
        }
        if (hy<ty-1) {
            ty--
            if (tx!=hx) tx=tx+((tx<hx)?1:-1)
        }
        tpos.push({tx, ty, hpos: [hx, hy]})
        steps--
    }
})

let res = tpos.map(el => `${el.tx}-${el.ty}`)

console.log('Part 1', [...new Set(res)].length)

// ---------------------------------------------------------------

let knots = Array.from({length: 9}, (_, i) => ({ id: i + 1, x: 11, y: 5}))
hx = 11
hy = 5
const moveKnot = (h, t) => {

    if (h.x > t.x + 1) {
        t.x++
        if (t.y != h.y) t.y = t.y + ((t.y < h.y) ? 1 : -1)
    }
    if (h.x < t.x - 1) {
        t.x--
        if (t.y != h.y) t.y = t.y + ((t.y < h.y) ? 1 : -1)
    }
    if (h.y > t.y + 1) {
        t.y++
        if (t.x != h.x) t.x = t.x + ((t.x < h.x) ? 1 : -1)
    }
    if (h.y < t.y - 1) {
        t.y--
        if (t.x != h.x) t.x = t.x + ((t.x < h.x) ? 1 : -1)
    }

    return {...t}
}

tpos = []
let head = { x: 11, y: 5 }
let t_head = {}
input.forEach(line=>{
    [dir, steps] = line.split(' ')
    while (steps > 0) {
        if (dir == 'R') head.x++
        if (dir == 'L') head.x--
        if (dir == 'U') head.y++
        if (dir == 'D') head.y--
        hpos.push({...head})
        // calc tpos based on hpos
        t_head = {...head}
        knots = knots.map(knot=>{
            t_head = moveKnot(t_head, knot)
            return knot
        })
        let tail = knots.find(knot=>knot.id == 9)
        tpos.push({ x: tail.x, y: tail.y })
        steps--
    }
})

res = tpos.map(el => `${el.x}-${el.y}`)
console.log('Part 2', [...new Set(res)].length)
