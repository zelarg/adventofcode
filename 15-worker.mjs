import { parentPort, workerData } from 'worker_threads'

function mergeRanges(ranges) {
    for (let i = 0; i<ranges.length; i++) {
        for (let j = i+1; j < ranges.length; j++) {
            let xmin = Math.min (ranges[i][1], ranges[j][1])
            let xmax = Math.max (ranges[i][0], ranges[j][0])
            if (Math.max (0, xmin - xmax + 1)) {
                ranges[j][0] = Math.min(ranges[i][0], ranges[j][0])
                ranges[j][1] = Math.max(ranges[i][1], ranges[j][1])
                ranges.splice(i, 1)
                i--; break;
            }
        }
    }
}

async function processLine(S2, y) {
    // for (let jj=0, jx=1; jj<10_000; jj++, jx=(Math.sqrt(jj))%1283421) {}
    let lineRanges = []
    let linerange
    for (let i=0; i<S2.length; i++) {
        let [sx, sy, srange] = S2[i]
        linerange = srange - Math.abs(sy - y)
        if (linerange > 0) {
            lineRanges.push([sx-linerange, sx+linerange])
        }
    }
    mergeRanges(lineRanges)
    if (lineRanges.length == 2) {
        if (lineRanges[0][0] > lineRanges[1][1] + 1) {
            return [lineRanges[1][1] + 1, y]
        }
        if (lineRanges[0][0] < lineRanges[1][1] - 1) {
            return [lineRanges[1][1] - 1, y]
        }
        if (lineRanges[0][1] > lineRanges[1][0] + 1) {
            return [lineRanges[1][1] + 1, y]
        }
        if (lineRanges[0][1] < lineRanges[1][0] - 1) {
            return [lineRanges[1][0] - 1, y]
        }
    }
    return 0
}

parentPort.on("message", async(message) => {
    // console.log(`-worker ${workerData.id} got message`, message)
    // parentPort.postMessage(['ping', `-worker id=${workerData.id} got message ${message}`])
    let [start, range] = message
    // for (let jj=0, jx=1; jj<1_000_000_000; jj++, jx=(Math.sqrt(jj))%1283421) {}
    for (let i = start; i<start+range; i++) {
        let res = await processLine(workerData.arr, i)
        if (res) {
            // for (let jj=0, jx=1; jj<1_000_000_000; jj++, jx=(Math.sqrt(jj))%1983421) {}
            parentPort.postMessage(res)
        }
    }
});

// console.log(`-worker ${workerData.id} initialized`)



