const {readFile, sumAll} = require('./helpers/utils')
const input = readFile('input/08-1.txt').split('\n').slice(0, -1)
// ---------------------------------------------

let rows = input.map(x=>x.split(''))
let transpose = rows[0].map((_, colIndex) => rows.map(row => row[colIndex]))

let rc = rows.length
let cc = transpose.length

let final = Array(rc).fill(0).map(()=>Array(cc).fill(0))

const visibleInRow = (row, i, reverse, transpose) => {
    max = -1
    row.forEach((x, j) => {
        let ii = (!transpose)?i:(reverse)?reverse-1-j:j
        let jj = (!transpose)?(reverse)?reverse-1-j:j:i
        final[ii][jj] = final[ii][jj] || (x > max)
        max = Math.max(max, x)
    })
}

rows.forEach((row,i) => {
    visibleInRow(row, i)
    visibleInRow(row.reverse(), i, cc)
})

transpose.forEach((row,i) => {
    visibleInRow(row, i, false, true)
    visibleInRow(row.reverse(), i, rc, true)
})

let res = final.map(row=>row.filter(x=>!!x).length)
console.log('Part 1', sumAll(res))

let scenic = Array(rc).fill(0).map(()=>Array(cc).fill(0))
rows = input.map(x=>x.split(''))
a = 0
for (let i=1; i < cc-1; i++) {
    for (let j=1; j < rc-1; j++) {
        let x = rows[i][j]
        a = j-1;
        while (a > 0 && rows[i][a] < x) a--
        scenic[i][j] = (j-a)

        a = j+1
        while (a < rc-1 && rows[i][a] < x) a++
        scenic[i][j] *= (a-j)

        a=i-1
        while (a > 0 && rows[a][j] < x) a--
        scenic[i][j] *= (i-a)

        a=i+1
        while (a<cc-1 && rows[a][j] < x) a++

        scenic[i][j] *= (a-i)
    }
}

console.log('Part 2', Math.max(...scenic.map(x => Math.max(...x))))



