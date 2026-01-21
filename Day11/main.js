const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

const gridSize = 300;

function partOne(input) {
  const serialNumber = Number(input);
  const grid = buildFuelCellGrid(serialNumber);

  const size = 3;

  let maxPower = 0;
  let maxPowerX = 0;
  let maxPowerY = 0;

  for (let x = 0; x <= gridSize - size; x++) {
    for (let y = 0; y < gridSize - size; y++) {
      let tally = 0;
      for (let i = x; i < x + size; i++) {
        for (let j = y; j < y + size; j++) {
          tally += grid[j][i];
        }
      }
      if (tally > maxPower) {
        maxPower = tally;
        maxPowerX = x + 1;
        maxPowerY = y + 1;
      }
    }
  }

  console.log(`MaxPower: ${maxPower}`);

  return `Cell: [${maxPowerX},${maxPowerY}]`;
}

function partTwo(input) {
  const serialNumber = Number(input);
  const grid = buildFuelCellGrid(serialNumber);

  let maxPower = -99999;
  let maxPowerX = 0;
  let maxPowerY = 0;
  let maxPowerSize = 0;

  let size = 3;
  const squares = new Object();

  for (let y = 0; y < gridSize - size; y++) {
    const seen = new Object();
    for (let x = 0; x < gridSize - size; x++) {
      let tally = 0;
      for (let i = x; i < x + size; i++) {
        let col = 0;
        if (seen[i] === undefined) {
          for (let j = y; j < y + size; j++) {
            col += grid[j][i];
          }
          seen[i] = col;
        } else {
          col = seen[i];
        }
        tally += col;
      }
      squares[`${x}-${y}`] = tally;
    }
  }

  for (size += 1; size < gridSize; size++) {
    for (let y = 0; y < gridSize - size; y++) {
      for (let x = 0; x < gridSize - size; x++) {
        let tally = squares[`${x}-${y}`];
        let j = size - 1;
        const dx = x + j;
        const dy = y + j;
        tally += grid[dy][dx];
        while (j > 0) {
          tally += grid[dy][dx - j];
          tally += grid[dy - j][dx];
          j--;
        }
        squares[`${x}-${y}`] = tally;
        if (tally > maxPower) {
          maxPower = tally;
          maxPowerX = x + 1;
          maxPowerY = y + 1;
          maxPowerSize = size;
        }
      }
    }
  }

  console.log(`MaxPower: ${maxPower}`);

  return `Cell: [${maxPowerX},${maxPowerY},${maxPowerSize}]`;
}

function buildFuelCellGrid(serialNumber) {
  const grid = [];
  for (let y = 0; y < gridSize; y++) {
    grid[y] = [];
    for (let x = 0; x < gridSize; x++) {
      grid[y][x] = calcCellPowerLevel(x + 1, y + 1, serialNumber);
    }
  }
  return grid;
}

function calcCellPowerLevel(x, y, serialNumber) {
  const rackId = x + 10;
  let powerLevel = rackId * y;
  powerLevel += serialNumber;
  powerLevel *= rackId;
  powerLevel = Math.trunc(powerLevel / 100);
  powerLevel %= 10;
  return powerLevel - 5;
}

function solveFile(filePath) {
  var input = fs.readFileSync(filePath).toString().trim();
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
