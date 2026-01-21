const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

const title = "## Day 1: Chronal Calibration ##"
const url = "https://adventofcode.com/2018/day/1"

function partOne(lines){
  return lines.reduce((a, b) => a + b, 0);
}

function partTwo(lines){
  const visited = new Set([0]);
  let freq = 0;
  let found = false;

  while (!found){
    for (let i = 0; i < lines.length; i++){
      freq += lines[i];
      if (visited.has(freq)){
        found = true;
        break;
      }
      else{
        visited.add(freq);
      }
    }
  }

  return freq;
}

function solveFile(filePath){
  var lines = fs.readFileSync(filePath).toString().trim().split('\n').map(Number);
  console.log(`\nFile: ${filePath}`)
  
  let start = performance.now();
  const result1 = partOne(lines);
  const mid = performance.now();
  console.log(`Part 1 result: ${result1} in ${(mid - start).toPrecision(6)}ms`)


  start = performance.now();
  const result2 = partTwo(lines);
  const end = performance.now();
  console.log(`Part 2 result: ${result2} in ${(end - start).toPrecision(6)}ms`)
}

console.log(title)
console.log(url)
for (let filePath of process.argv.slice(2)){
  solveFile(filePath);
}
