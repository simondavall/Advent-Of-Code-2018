const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

const title = "## Day 23: Experimental Emergency Teleportation ##"
const url = "https://adventofcode.com/2018/day/23"

class Position{
  constructor(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
  }

  getDistanceTo(other) {
    return Math.abs(this.x - other.x)
      + Math.abs(this.y - other.y)
      + Math.abs(this.z - other.z)
  }

  add(other){
    const current = new Position(this.x, this.y, this.z);
    current.x += other.x;
    current.y += other.y;
    current.z += other.z;
    return current;
  }

  multiplyBy(n){
    const current = new Position(this.x, this.y, this.z);
    current.x *= n;
    current.y *= n;
    current.z *= n;
    return current;
  }

  toString(){
    return `x:${this.x}, y:${this.y}, z:${this.z}`
  }
}

class Cube{
  constructor(pos, side){
    this.position = pos;
    this.side = side;
    this.bots = 0;
  }

  toString(){
    return `pos:${this.position.x}, ${this.position.y}, ${this.position.z}, side:${this.side}, bots:${this.bots}`
  }
}

class NanoBot{
  constructor(x, y, z, r){
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = r;
  }

  getDistanceTo(other = new NanoBot(0,0,0,0)){
    return Math.abs(this.x - other.x)
      + Math.abs(this.y - other.y)
      + Math.abs(this.z - other.z)
  }

  getKey(){
    return `${this.x};${this.y};${this.z}`;
  }

  toString(){
    return `x:${this.x}, y:${this.y}, z:${this.z}, radius:${this.radius}`
  }
}

const origin = new Position(0,0,0);

function partOne(input) {
  const bots = getBots(input);
  const strongBot = bots.sort((a,b) => b.radius - a.radius)[0];

  let tally = 0;

  for (const bot of Object.values(bots)){
    if (bot.getDistanceTo(strongBot) <= strongBot.radius){
      tally++;
    }
  }
  
  return tally;
}

function partTwo(input) {

  const bots = getBots(input);
  const maxDist =  bots.sort((a, b) => b.getDistanceTo() - a.getDistanceTo())[0].getDistanceTo();
  let step = 1;
  while (step < maxDist){
    step *= 2;
  }

  let current = new Cube(new Position(-step, -step, -step), step * 2);
  current.bots = botsInCube(current.position, current.side, bots);
  let cubes = new Array(current);
  let lastSide = 1 << 31; // int32 max
  do {
    cubes.sort((a,b) => a.side - b.side);
    cubes.sort((a,b) => cubeMinOrigoDistance(a.position, a.side) - cubeMinOrigoDistance(b.position, b.side));
    cubes.sort((a,b) => b.bots - a.bots);
    current = cubes[0];
    cubes.splice(0, 1); // remove item
    if (current.side > 1){
      const nextSide = current.side / 2;
      for (const corner of corners){
        const new_corner = corner.multiplyBy(nextSide);
        const new_position = current.position.add(new_corner);
        const cube = new Cube(new_position, nextSide);
        cube.bots = botsInCube(cube.position, cube.side, bots);
        if (cube.bots > 0){
          cubes.push(cube);
        }
        if (nextSide < lastSide){
          lastSide = nextSide;
        }
      }
    }
  } while(current.side > 1);
  
  const bestPosition = current.position;
  return bestPosition.getDistanceTo(origin);
}

function botsInCube(position, side, bots){
  let sum = 0;
  for (const b of bots){
    if (isInCube(position, side, b)){
      sum++;
    }
  }
  return sum;
}

const corners = [
  new Position(0,0,0),
  new Position(0,0,1),
  new Position(0,1,0),
  new Position(0,1,1),
  new Position(1,0,0),
  new Position(1,0,1),
  new Position(1,1,0),
  new Position(1,1,1),
];

function isInCube(pos, side, bot){
  let offset = 0, distance = 0;
  offset = Math.max(pos.x - bot.x, 0); distance += offset;
  offset = Math.max(bot.x - (pos.x + side - 1), 0); distance += offset;
  offset = Math.max(pos.y - bot.y, 0); distance += offset;
  offset = Math.max(bot.y - (pos.y + side - 1), 0); distance += offset;
  offset = Math.max(pos.z - bot.z, 0); distance += offset;
  offset = Math.max(bot.z - (pos.z + side - 1), 0); distance += offset;
  return distance <= bot.radius;
}

function cubeMinOrigoDistance(pos, side){
  let p = new Position();
  p.x = smallestAbs(pos.x, pos.x + side - 1);
  p.y = smallestAbs(pos.y, pos.y + side - 1);
  p.z = smallestAbs(pos.z, pos.z + side - 1);
  return p.getDistanceTo(origin);
}

function smallestAbs(a, b)
{ 
  return Math.abs(a) < Math.abs(b) ? a : b; 
}

function getBots(input){
  const regEx = /^pos=<(-?\d+),(-?\d+),(-?\d+)>,\sr=(\d+)$/s;
  const bots = [];

  for(const line of input){
    const m = line.match(regEx);
    const nb = new NanoBot(+m[1], +m[2], +m[3], +m[4]);

    bots.push(nb);
  }

  return bots;
}

function solveFile(filePath) {
  var input = fs.readFileSync(filePath).toString().trim().split("\n");
  console.log(`\nFile: ${filePath}`);

  let start = performance.now();
  const result1 = partOne(input);
  const mid = performance.now();
  console.log(`Part 1 result: ${result1} in ${(mid - start).toPrecision(6)}ms`);

  start = performance.now();
  const result2 = partTwo(input);
  const end = performance.now();

  console.log(`Part 2 result: ${result2} in ${(end - start).toPrecision(6)}ms`);
}

console.log(title)
console.log(url)
for (let filePath of process.argv.slice(2)) {
  solveFile(filePath);
}
