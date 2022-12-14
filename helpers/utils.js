import fs from 'fs'
import https from 'https'
import dotenv from 'dotenv'
import rfdc from 'rfdc' // Really Fast Deep Clone
import chalk from 'chalk'

dotenv.config()
const clone = rfdc()

const downloadInput = async (fileName) => {
    const dayMatch = fileName.match(/(\d+)/)
    if (!dayMatch || dayMatch.length < 1) {
        console.log('invalid filename', fileName)
        return
    }
    const day = dayMatch[1]
    const options = {
        hostname: 'adventofcode.com',
        path: `/2022/day/${day}/input`,
        headers: {
            cookie: `session=${process.env.aoc_session}`
        }
    }

    return await new Promise((resolve, reject) => {
            https.get(options, response => {
                const code = response.statusCode ?? 0
                if (code >= 400) {
                    return reject(new Error(response.statusMessage))
                }
                const file = fs.createWriteStream(fileName)
                response.pipe(file)
                // after download completed close filestream
                file.on("finish", () => {
                    file.close()
                    console.log("Download Completed")
                    resolve({})
                });
            }).on('error', error => {
                reject(error)
            })
        }
    )
}
const readFile = async (fileName) => {
    if (!fs.existsSync(fileName)) {
        process.stdout.write(`downloading input file '${fileName}'... `)
        const res = await downloadInput(fileName)
        if (res) {
            return fs.readFileSync(fileName, 'utf8')
        }
    } else {
        return fs.readFileSync(fileName, 'utf8')
    }
}

const took = (msg = '') => {
    const t1 = performance.now()
    console.log(chalk.gray(`-- [${msg}] took ${Math.round((t1 - t0) * 100) / 100} ms --`))
    t0 = performance.now() // reset timer for next measurement
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const sort = (arr, prop, asc = true) => {
    if (prop)
        return arr.sort(function (a, b) {
            return (asc) ? a[prop] - b[prop] : b[prop] - a[prop];
        })
    else
        return arr.sort(function (a, b) {
            return (asc) ? a - b : b - a;
        })
}

const prod = (arr, prop) => {
    if (prop)
        return arr.reduce((acc, x) => (acc * x[prop]), 1)
    else
        return arr.reduce((acc, x) => (acc * x), 1)
}

const sum = (arr, prop) => {
    if (prop)
        return arr.reduce((acc, x) => (acc + +x[prop]), 0)
    else
        return arr.reduce((acc, x) => (acc + +x), 0)
}

const max = (arr, prop) => {
    if (prop)
        return Math.max(...arr.map(x => +x[prop]))
    else
        return Math.max(...arr)
}

const set = (arr, prop) => {
    if (prop)
        return [...new Set(arr.map(x => x[prop]))]
    else
        return [...new Set(arr)]
}

const assert = (got, expected) => {
    if (expected == got) {
        console.log(chalk.blue.bgWhite(' [CORRECT] '), got)
    } else {
        console.log(chalk.red.bgWhite(` [WRONG]  ${got} != ${expected}`))
    }
}

const transpose = (arr) => {
    return arr[0].map((_, colIndex) => arr.map(row => row[colIndex]))
}

const range = (from, to, step = 1) => {
    if (step == 0) {
        step = 1
    }
    if (typeof to === 'undefined') {
        to = from, from = 0
    }
    const emptyArray = Array(Math.ceil((to - from) / step)).keys()
    // round to 4 decimal places to avoid 0.1 + 0.2 != 0.3 problem
    return [...emptyArray].map((x, i) => {
        return Math.round((from + i * step) * 10000) / 10000.0
    })
}

const create2Darray = (rows, cols, value=0) => {
    return Array(rows).fill(value).map(()=>Array(cols).fill(value))
}

const search2Darray = (arr, needle) => {
    for(var i = 0; i < arr.length; i++){
        let j = arr[i].indexOf(needle)
        if (j >= 0) {
            return [i, j]
        }
    }
    return false
}

// ============ init ============
let t0 = performance.now()
console.log(chalk.whiteBright(' ===== init ====='))

export {
    readFile,
    clone,
    took,
    sleep,
    sort,
    prod,
    sum,
    set,
    transpose,
    assert,
    range,
    search2Darray,
    create2Darray,
}