const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

class Star {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }

  toString() {
    return `x:${this.x}, y:${this.y}, dx:${this.dx}, dy:${this.dy}`;
  }
}

function partOne(input) {
  const stars = buildStars(input);
  let gridSize = calcSize(stars);
  let count = 0;
  let foundMessage = false;

  // The theory is that the message will occur when the
  // grid is at its smallest.

  // let's look for the first occurrance when the grid
  // size stars to get bigger. Take it back a step and
  // the should be our message.

  while (!foundMessage) {
    advanceStars(stars);
    const size = calcSize(stars);
    if (size.area > gridSize) {
      reverseStars(stars);
      foundMessage = true;
    } else {
      gridSize = size.area;
    }
  }

  printGrid(stars);

  return 0;
}

function partTwo(input) {
  const stars = buildStars(input);
  let gridSize = calcSize(stars);
  let count = 0;
  let foundMessage = false;

  while (!foundMessage) {
    advanceStars(stars);
    const size = calcSize(stars);
    if (size.area > gridSize) {
      reverseStars(stars);
      foundMessage = true;
    } else {
      gridSize = size.area;
      count++;
    }
  }

  return count;
}

function calcSize(stars) {
  let maxX = 0,
    minX = 999999;
  let maxY = 0,
    minY = 999999;
  for (const star of stars) {
    minX = Math.min(minX, star.x);
    maxX = Math.max(maxX, star.x);
    minY = Math.min(minY, star.y);
    maxY = Math.max(maxY, star.y);
  }
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  return {
    area: height * width,
    height: height,
    width: width,
    minX: minX,
    minY: minY,
  };
}

function printGrid(stars) {
  const size = calcSize(stars);
  const grid = new Array(size.height);

  for (let y = 0; y < size.height; y++) {
    grid[y] = new Array(size.width);
    grid[y].fill(".");
  }

  for (const star of stars) {
    grid[star.y - size.minY][star.x - size.minX] = "#";
  }

  grid.forEach((row) => console.log(...row));
  console.log();
}

function advanceStars(stars) {
  for (const star of stars) {
    star.x += star.dx;
    star.y += star.dy;
  }
}

function reverseStars(stars) {
  for (const star of stars) {
    star.x -= star.dx;
    star.y -= star.dy;
  }
}

function buildStars(input){
  const regEx = /<(\s?\W?\d+),\s(\s?\W?\d+)>/g;
  const stars = [];
  for (const line of input) {
    const m = line.matchAll(regEx);
    const arr = Array.from(m);
    assert(
      arr.length == 2,
      `Input has unrecognized format. Length:${arr.length} Value: ${line}`,
    );
    let x = +arr[0][1];
    let y = +arr[0][2];
    let dx = +arr[1][1];
    let dy = +arr[1][2];
    stars.push(new Star(x, y, dx, dy));
  }

  return stars;
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
