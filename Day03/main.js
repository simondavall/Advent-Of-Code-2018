const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

const title = "## Day 3: No Matter How You Slice It ##"
const url = "https://adventofcode.com/2018/day/3"

const fabric = [];
let claims_g = [];
let maxHeight = 0;
let maxWidth = 0;

function toRecSpec(arr){
  return { id: arr[0], left: arr[1], top: arr[2], width: arr[3], height: arr[4] };
}

function getClaims(lines){
  const regEx = /^#(\d+)\s@\s(\d+),(\d+):\s(\d+)x(\d+)$/i
  const claims = [];
  for (const line of lines){
    const item = line.split(regEx).filter(x => x != '').map(Number);
    const claim = toRecSpec(item);
    const w = claim.left + claim.width;
    const h = claim.top + claim.height;
    maxWidth = Math.max(maxWidth, w);
    maxHeight = Math.max(maxHeight, h);

    claims.push(claim)
  }

  return claims;
}

function fillFabric(claims){
  for (let i = 0; i < maxHeight; i++){
    fabric[i] = [];
  }

  for(var c of claims){
    for (let x = c.left; x < c.width + c.left; x++){
      for (let y = c.top; y < c.height + c.top; y++){
        fabric[x][y] = (fabric[x][y] | 0) + 1;
      }
    }
  }
}

function partOne(lines){

  const claims = getClaims(lines);

  fillFabric(claims);

  let tally = 0;

  for (let x = 0; x < maxWidth; x++){
    for (let y = 0; y < maxHeight; y++){
      if (fabric[x][y] > 1){
        tally += 1;
      }
    }
  }

  claims_g = claims;

  return tally;
}

function partTwo(){
  for(var c of claims_g){
    skip = false;
    for (let x = c.left; x < c.width + c.left; x++){
      for (let y = c.top; y < c.height + c.top; y++){
        if (fabric[x][y] > 1){
          skip = true;
          break;
        }
      }
      if (skip)
        break;
    }
    if (!skip)
      return c.id;
  }


  return 0;
}

function solveFile(filePath){
  var lines = fs.readFileSync(filePath).toString().trim().split('\n');
  console.log(`\nFile: ${filePath}`)
  
  let start = performance.now();
  const result1 = partOne(lines);
  const mid = performance.now();
  console.log(`Part 1 result: ${result1} in ${(mid - start).toPrecision(6)}ms`)


  start = performance.now();
  const result2 = partTwo();
  const end = performance.now();
  const arr = Array.from(result2).sort();

  console.log(`Part 2 result: ${result2} in ${(end - start).toPrecision(6)}ms`)
}

console.log(title)
console.log(url)
for (let filePath of process.argv.slice(2)){
  solveFile(filePath);
}
