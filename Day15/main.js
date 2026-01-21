const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");
const { Queue } = require("../Utils/Queue.js");

const title = "## Day 15: Beverage Bandits ##"
const url = "https://adventofcode.com/2018/day/15"

class Unit {
  constructor(id, r, c, type) {
    this.id = id;
    this.row = r;
    this.col = c;
    this.type = type;
    this.power = 3;
    this.health = 200;
    this.dead = false;
  }
}

const directions = {
  0: { dr: -1, dc: 0 },
  1: { dr: 0, dc: -1 },
  2: { dr: 0, dc: 1 },
  3: { dr: 1, dc: 0 },
};

let map = [];
let units = [];
let deadUnits = new Set();
let height = 0;
let width = 0;

function moveUnit(unit, map) {
  const next = getShortestPathToEnemy(
    unit.row,
    unit.col,
    getEnemyType(unit),
    map,
  );
  if (next !== undefined && next !== null) {
    map[unit.row][unit.col] = ".";
    unit.row = next[0];
    unit.col = next[1];
    map[unit.row][unit.col] = unit.type;
  }
}

function combat(unit, map, superElf) {
  let weakestEnemy = null;
  let minHealth = 999;

  for (const { dr, dc } of dirValues) {
    const nr = unit.row + dr;
    const nc = unit.col + dc;
    const adj = getUnitAtLocation(nr, nc);
    if (
      adj != null &&
      adj.type != unit.type &&
      adj.health < minHealth &&
      adj.health > 0
    ) {
      minHealth = adj.health;
      weakestEnemy = adj;
    }
  }
  //attack them
  if (weakestEnemy != null) {
    weakestEnemy.health -= unit.power;
    if (weakestEnemy.health <= 0) {
      if (superElf && weakestEnemy.type == "E") {
        return true;
      }
      deadUnits.add(weakestEnemy.id);
      weakestEnemy.dead = true;
      map[weakestEnemy.row][weakestEnemy.col] = ".";
      units = units.filter((x) => !x.dead);
    }
  }
  return false;
}

function doBattle(superElf) {
  let rounds = 0;
  deadUnits = new Set();
  while (true) {
    units.sort((a, b) => byReadingOrder(a, b));
    let battleMap = drawBattleMap();

    const combatants = units.map((x) => x.id);
    for (const id of combatants) {
      const unit = getUnit(id);
      if (unit == null) {
        continue;
      }

      if (!hasEnemies(unit)) {
        // battle over
        const hitPoints = units
          .filter((x) => !x.dead)
          .reduce((a, b) => a + b.health, 0);

        return { rounds: rounds, hitPoints: hitPoints };
      }

      battleMap = drawBattleMap();
      moveUnit(unit, battleMap);
      const elfDies = combat(unit, battleMap, superElf);
      if (elfDies) {
        return null;
      }
    }

    rounds++;
  }
}

function partOne(input) {
  dirValues = Object.values(directions);
  const superElves = false;

  setupMap(input);
  setupUnits(0);

  const result = doBattle(superElves);

  return result.rounds * result.hitPoints;
}

function partTwo(input) {
  const superElves = true;

  let result = null;
  let addedPower = 0;

  while (result == null) {
    setupMap(input);
    setupUnits(++addedPower);
    result = doBattle(superElves);
  }

  return result.rounds * result.hitPoints;
}

function getShortestPathToEnemy(r, c, target, map) {
  const seen = new Set();
  const q = new Queue([{ r: r, c: c, path: [] }]);
  const found = [];

  let shortestPathLenth = 999;
  while (!q.isEmpty()) {
    const pt = q.dequeue();
    if (pt.path.length > shortestPathLenth) {
      found.sort((a, b) => byReadingOrder(a, b));
      return found[0].path[0];
    }
    for (const { dr, dc } of dirValues) {
      const nr = pt.r + dr;
      const nc = pt.c + dc;
      if (map[nr][nc] == target) {
        shortestPathLenth = Math.min(shortestPathLenth, pt.path.length);
        found.push({ row: nr, col: nc, path: pt.path });
        continue;
      }
      if (seen.has(`${nr}-${nc}`)) {
        continue;
      }
      seen.add(`${nr}-${nc}`);
      if (isValidMove(nr, nc, map)) {
        q.enqueue(setArgs(nr, nc, pt.path));
      }
    }
  }
  if (found.length > 0) {
    found.sort((a, b) => byReadingOrder(a, b));
    return found[0].path[0];
  }
  return null;
}

function hasEnemies(unit) {
  return units.filter((x) => x.type != unit.type && !x.dead).length > 0;
}

function getUnitAtLocation(r, c) {
  for (const unit of units) {
    if (unit.row == r && unit.col == c) {
      return unit;
    }
  }
  return null;
}

function getUnit(id) {
  for (const unit of units) {
    if (unit.id == id) {
      return unit;
    }
  }
  return null;
}

function setArgs(r, c, path) {
  const arr = path.slice();
  arr.push([r, c]);
  return { r: r, c: c, path: arr };
}

function isValidMove(r, c, map) {
  return map[r][c] == ".";
}

function byReadingOrder(a, b) {
  return a.row * height + a.col - (b.row * height + b.col);
}

function drawBattleMap() {
  const arr = [];
  for (let i = 0; i < height; i++) {
    arr[i] = map[i].slice();
  }
  for (const u of units.filter((x) => !x.dead)) {
    arr[u.row][u.col] = u.type;
  }
  return arr;
}

function printMap(withValues = false) {
  const arr = [];
  console.log();
  for (let i = 0; i < height; i++) {
    arr[i] = map[i].slice();
  }
  for (const u of units.filter((x) => !x.dead)) {
    if (withValues) {
      arr[u.row][u.col] = `${u.type} (${u.health})`;
    } else {
      arr[u.row][u.col] = u.type;
    }
  }
  arr.forEach((row) => console.log(...row));
}

function getEnemyType(unit) {
  return unit.type == "G" ? "E" : "G";
}

function setupMap(input) {
  for (let i = 0; i < input.length; i++) {
    map[i] = input[i].split("");
  }
  height = map.length;
  width = map[0].length;
}

function setupUnits(addedPower) {
  units = [];
  let idx = 0;
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (map[r][c] == "G") {
        units.push(new Unit(idx++, r, c, map[r][c]));
        map[r][c] = ".";
      }
      if (map[r][c] == "E") {
        const elf = new Unit(idx++, r, c, map[r][c]);
        elf.power += addedPower;
        units.push(elf);
        map[r][c] = ".";
      }
    }
  }
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
