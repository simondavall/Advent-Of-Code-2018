const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");


class Point4D{
  constructor(id,a,b,c,d){
    this.id = id;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  getDistanceTo(other){
    return Math.abs(this.a - other.a)
      + Math.abs(this.b - other.b)
      + Math.abs(this.c - other.c)
      + Math.abs(this.d - other.d)
  }
}

let nextId = 0;
const visited = new Set();


function checkNeighbours(current, neighbours, points){
  for (const p of points){
    if (visited.has(p.id)){
      continue;
    }
    if (p.getDistanceTo(current) <= 3){
      // we have a new neighbour
      visited.add(p.id);
      neighbours.add(p.id);
      checkNeighbours(p, neighbours, points);
    }
  }
}

function partOne(input){
  const points = [];
  const constellations = [];

  input.forEach(line => points.push(new Point4D(nextId++, ...line.split(','))));

  for (const p of points){
    if (visited.has(p.id)) { continue; }
    // create new constallation
    constellation = new Set([p.id]);
    checkNeighbours(p, constellation, points);
    constellations.push(constellation);
  }

  return constellations.length;
}

function partTwo(input){

  let tally = 0;

  return tally;
}

function solveFile(filePath){
  var input = fs.readFileSync(filePath).toString().trim().split('\n');
  console.log(`\\\nFile: ${filePath}\\`)
  
  let start = performance.now();
  const result1 = partOne(input);
  const mid = performance.now();
  console.log(`Part 1 result: ${result1} in ${(mid - start).toPrecision(6)}ms\\`)

  start = performance.now();
  const result2 = partTwo(input);
  const end = performance.now();

  console.log(`Part 2 result: ${result2} in ${(end - start).toPrecision(6)}ms\\`)
}

for (let filePath of process.argv.slice(2)){
  solveFile(filePath);
}
