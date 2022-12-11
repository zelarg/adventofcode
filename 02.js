const { readFile } = require('./helpers/utils')
const input = readFile('input/02-1.txt')
// ---------------------------------------------

// A,X=Rock(+1b.), B,Y=Paper(+2b.), C,Z=Scissors(+3b.)
// Loss=+0b., Draw=+3b., Win=+6b.
// Replace A,X=1 B,Y=2 C,Z=3
// Loss: AZ, BX, CY -> A-Z=-2, B-X=1, C-Y=1; points: 0
// Draw: AX, BY, CZ -> A-X=B-Y=C-Z=0; points: 3
// Win:  AY, BZ, CX -> A-Y=-1, B-Z=-1, C-X=2; points: 6

let p = input.replace(/A|X/g, 1).replace(/B|Y/g, 2).replace(/C|Z/g, 3).split('\n').slice(0, -1);
let r = p.map(x => { let t = x.split(' '); let d = t[0]-t[1]; d = (d>-1)?d:d+3;  return ((d==2)?6:(1-d)*3)+(+t[1]) })
    .reduce((acc,x) => (acc + x), 0)
console.log('Round 1, points', r)

// Part 2:
// X=Loss: For loss, 0 points are awarded, +what I play;
// If they play A (1), I play C (3); B (2) -> A (1); C (3) -> B (2); 1->3, 2->1, 3->2; (t[0]-1==0)?3:t[0]-1
// Y=draw: 3 points + Play same (t[0])
// Z=win: 6 points + 1->2, 2->3, 3->1 (t[0]+1==4)?1:t[0]+1
r = p.map(x => { let t = x.split(' '); return { i: x, a: (t[1]==2)? (+t[0]+3) : (t[1]==1) ? ((t[0]-1==0)?3:+t[0]-1) : (6+ ((+t[0]+1==4)?1:+t[0]+1) ) }})
     .reduce((acc,x) => (acc + x.a), 0)

console.log('Round 2, points', r)