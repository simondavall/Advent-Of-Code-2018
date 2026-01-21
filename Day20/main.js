const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");
const { Stack } = require("../Utils/Stack.js");

const title = "## Day 20: A Regular Map ##"
const url = "https://adventofcode.com/2018/day/20"

const directions = {
  N: { dx: 0, dy: -1, char: "-" },
  E: { dx: 1, dy: 0, char: "|" },
  S: { dx: 0, dy: 1, char: "-" },
  W: { dx: -1, dy: 0, char: "|" },
};

let doors = new Object();

function populateDoors(input) {
  const path = new Stack();
  doors = new Object();

  let x = 0;
  let y = 0;
  let prevX = 0;
  let prevY = 0;

  for (let i = 1; i < input.length - 1; i++) {
    const ch = input[i];
    if (ch == "(") {
      path.push({ x: x, y: y });
    } else if (ch == ")") {
      const b = path.pop();
      x = b.x;
      y = b.y;
    } else if (ch == "|") {
      const b = path.peek();
      x = b.x;
      y = b.y;
    } else {
      x += directions[ch].dx;
      y += directions[ch].dy;
      doorKeys = Object.keys(doors);
      const prevKey = `${prevX}-${prevY}`;
      if (!doorKeys.includes(prevKey)) {
        doors[prevKey] = 0;
      }
      const doorKey = `${x}-${y}`;
      if (doorKeys.includes(doorKey)) {
        doors[doorKey] = Math.min(doors[doorKey], doors[prevKey] + 1);
      } else {
        doors[doorKey] = doors[prevKey] + 1;
      }
    }
    prevX = x;
    prevY = y;
  }
  return doors;
}

function partOne(input) {
  populateDoors(input);

  const doorValues = Object.values(doors);
  const n = doorValues.reduce((acc, cur) => Math.max(cur, acc), 0);
  return n;
}

function partTwo(input) {
  const doorValues = Object.values(doors);
  const n = doorValues.filter(x => x >= 1000).length;
  return n;
}

function solveFile(filePath) {
  var input = fs.readFileSync(filePath).toString().trim().split("");
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
