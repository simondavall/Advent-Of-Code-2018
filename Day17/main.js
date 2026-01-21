const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

let grid = [];
let minX = 999;
let maxX = 0;
let minY = 999;
let maxY = 0;
let height = 0;
let width = 0;

function partOne(input) {
  grid = buildGrid(input);

  let curX = 500 - minX;
  let curY = 0;

  getFlow(curX, curY);

  // print grid
  // grid.forEach((row) => console.log(...row));

  let tally = 0;
  for (let i = 0; i <= height; i++) {
    for (let j = 0; j <= width; j++) {
      if ("|~".includes(grid[i][j])) {
        tally++;
      }
    }
  }

  return tally;
}

function partTwo(input) {
  let tally = 0;
  for (let i = 0; i <= height; i++) {
    for (let j = 0; j <= width; j++) {
      if (grid[i][j] == "~") {
        tally++;
      }
    }
  }

  return tally;
}

function getFlow(x, y) {
  if (isOutOfBounds(x, y)) {
    return false;
  }
  grid[y][x] = "|";
  if (!isBlocked(x, y + 1)) {
    if (!getFlow(x, y + 1, [])) {
      return false;
    }
  }
  const left = isBlockedLeft(x, y);
  const right = isBlockedRight(x, y);

  if (left && right) {
    let i = x;
    while (!isBlocked(i, y)) {
      i--;
    }
    while (!isBlocked(++i, y)) {
      grid[y][i] = "~";
    }
    return true;
  }
  return false;
}

function isBlockedLeft(x, y) {
  if (isOutOfBounds(x, y)) {
    return false;
  }
  grid[y][x] = "|";
  if (!isBlocked(x, y + 1)) {
    if (!getFlow(x, y + 1)) {
      return false;
    }
  }
  if (isBlocked(x - 1, y)) {
    return true;
  } else {
    return isBlockedLeft(x - 1, y);
  }
}

function isBlockedRight(x, y) {
  if (isOutOfBounds(x, y)) {
    return false;
  }
  grid[y][x] = "|";
  if (!isBlocked(x, y + 1)) {
    if (!getFlow(x, y + 1)) {
      return false;
    }
  }
  if (isBlocked(x + 1, y)) {
    return true;
  } else {
    return isBlockedRight(x + 1, y);
  }
}

function isOutOfBounds(x, y) {
  return x <= 0 || x >= width + 1 || y < 0 || y >= height;
}

function isBlocked(x, y) {
  return grid[y][x] == "#" || grid[y][x] == "~";
}

function buildGrid(input) {
  minX = 999;
  minY = 999;
  maxX = 0;
  maxY = 0;
  const re = /(\w)=(\d+), (\w)=(\d+)\.\.(\d+)/;
  const data = input.map((x) => x.match(re));
  const points = [];
  for (const line of data) {
    const arr = deconstructData(line);
    points.push(...arr);
  }
  points.forEach((pt) => {
    minX = Math.min(minX, pt.x);
    maxX = Math.max(maxX, pt.x);
    minY = Math.min(minY, pt.y);
    maxY = Math.max(maxY, pt.y);
  });
  height = maxY - minY + 1;
  width = maxX - minX + 1;
  const grid = new Array(height);
  for (let i = 0; i <= height; i++) {
    grid[i] = new Array(width + 1);
    grid[i].fill(".");
  }

  for (const pt of points) {
    grid[pt.y - minY][pt.x - minX] = "#";
  }

  return grid;
}

function deconstructData(data) {
  arr = [];
  const a = +data[2];
  const low = +data[4];
  const high = +data[5];
  for (let b = low; b <= high; b++) {
    if (data[1] == "x") {
      arr.push({ x: a, y: b });
    } else {
      arr.push({ x: b, y: a });
    }
  }
  return arr;
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

for (let filePath of process.argv.slice(2)) {
  solveFile(filePath);
}
