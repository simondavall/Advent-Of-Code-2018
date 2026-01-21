const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

const title = "## Day 18: Settlers of The North Pole ##"
const url = "https://adventofcode.com/2018/day/18"

const neighbours = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 1, dy: 1 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: -1, dy: -1 },
];
let grid = [];
let height = 0;
let width = 0;

function partOne() {
  let minutes = 10;
  while (minutes-- > 0) {
    new_grid = [];
    for (let y = 0; y < height; y++) {
      new_grid.push(new Array(width));
      for (let x = 0; x < width; x++) {
        const n = getNeighbours(x, y);
        new_grid[y][x] = transform(grid[y][x], n);
      }
    }
    grid = new_grid;
  }

  let trees = 0;
  let lumberyards = 0;

  for (const row of grid) {
    trees += row.filter((x) => x == "|").length;
    lumberyards += row.filter((x) => x == "#").length;
  }

  //console.log(`trees:${trees}, lumber:${lumberyards}`);
  return trees * lumberyards;
}

function partTwo() {
  let visited = new Set();
  let minutes = 1000000000;
  let initial_repeat = 0;
  let repeat_frequency = 0;
  let found_repeat = false;
  while (minutes-- > 0) {
    new_grid = [];
    let signature = 0;
    for (let y = 0; y < height; y++) {
      new_grid.push(new Array(width));
      for (let x = 0; x < width; x++) {
        const n = getNeighbours(x, y);
        const cur = grid[y][x];
        signature += cur.charCodeAt(0) * x * y;
        new_grid[y][x] = transform(grid[y][x], n);
      }
    }
    if (visited.has(signature)){
      if (!found_repeat){
        //console.log(`Found initial repeat signature: after:${visited.size} rounds`);
        initial_repeat == visited.size;
        found_repeat = true;
      }
      else{
        //console.log(`Found next repeat signature: after:${visited.size} rounds`);
        repeat_frequency = visited.size;
        // reduce minutes by chunks of repeated requency
        minutes = Math.round(minutes % repeat_frequency);

      }
      visited = new Set();
    }
    visited.add(signature);
    grid = new_grid;
  }

  let trees = 0;
  let lumberyards = 0;

  for (const row of grid) {
    trees += row.filter((x) => x == "|").length;
    lumberyards += row.filter((x) => x == "#").length;
  }

  //console.log(`trees:${trees}, lumber:${lumberyards}`);
  return trees * lumberyards;
  let tally = 0;

  return tally;
}

function transform(cur, n) {
  switch (cur) {
    case ".":
      if (n.filter((e) => e == "|").length >= 3) {
        return "|";
      } else {
        return ".";
      }
      break;
    case "|":
      if (n.filter((e) => e == "#").length >= 3) {
        return "#";
      } else {
        return "|";
      }
      break;
    case "#":
      if (
        n.filter((e) => e == "#").length >= 1 &&
        n.filter((e) => e == "|").length >= 1
      ) {
        return "#";
      } else {
        return ".";
      }
      break;
    default:
      assert.fail(`Unkown area. Value: '${cur}'`);
  }
}

function getNeighbours(x, y) {
  const n = [];
  for (const { dx, dy } of neighbours) {
    const nx = x + dx;
    const ny = y + dy;
    if (!isOutOfBounds(nx, ny)) n.push(grid[ny][nx]);
  }
  return n;
}

function isOutOfBounds(x, y) {
  return x < 0 || x >= width || y < 0 || y >= height;
}

function solveFile(filePath) {
  grid = [];
  const orig = [];
  var input = fs.readFileSync(filePath).toString().trim().split("\n");
  height = input.length;
  width = input[0].length;
  input.forEach((line) => orig.push(line.trim().split("")));

  console.log(`\nFile: ${filePath}`);
  grid = orig.slice();
  let start = performance.now();
  const result1 = partOne();
  const mid = performance.now();
  console.log(`Part 1 result: ${result1} in ${(mid - start).toPrecision(6)}ms`);

  grid = orig.slice();
  start = performance.now();
  const result2 = partTwo();
  const end = performance.now();

  console.log(`Part 2 result: ${result2} in ${(end - start).toPrecision(6)}ms`);
}

console.log(title)
console.log(url)
for (let filePath of process.argv.slice(2)) {
  solveFile(filePath);
}
