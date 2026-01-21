const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");
const { PriorityQueue } = require("../Utils/Queue.js");

let height = 0;
let width = 0;
let map = [];
let dirValues = [];
let dirKeys = [];

class Cart {
  constructor(index, r, c, dir) {
    this.id = index;
    this.row = r;
    this.col = c;
    this.dir = dirKeys.indexOf(dir);
    this.turn = 0;
    this.crashed = false;
  }

  toString() {
    const cur = this;
    return `id:${cur.id}: r:${cur.row}, c:${cur.col}, ${dirKeys[cur.dir]}, t:${cur.turn}`;
  }

  advance() {
    const cur = this;
    const dir = +cur.dir;
    let n = dirValues[dir];
    cur.row += n.dr;
    cur.col += n.dc;
    const ch = map[cur.row][cur.col];
    switch (ch) {
      case "\\":
        cur.dir = 3 - dir;
        break;

      case "/":
        if (dir == 0 || dir == 2) {
          cur.dir = dir + 1;
        } else {
          cur.dir = dir - 1;
        }
        break;

      case "+":
        switch (cur.turn) {
          case 0:
            cur.dir = dir + 3;
            break;
          case 1:
            cur.dir = dir;
            break;
          case 2:
            cur.dir = dir + 1;
            break;
        }
        cur.turn += 1;
        cur.turn %= 3;
        cur.dir %= 4;
        break;

      default:
        // continue in the same direction.
        break;
    }
  }

  priority() {
    const current = this;
    return current.row * height + current.col;
  }
}
const directions = {
  "^": { dr: -1, dc: 0 },
  ">": { dr: 0, dc: 1 },
  v: { dr: 1, dc: 0 },
  "<": { dr: 0, dc: -1 },
};
const track = [];

function partOne(input) {
  dirKeys = Object.keys(directions);
  dirValues = Object.values(directions);

  height = input.length;
  width = input[0].length;
  let crashLocation = 0;

  let carts = [];

  for (const line of input) {
    map.push(Array.from(line));
  }

  let cartId = 1;
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if ("<>^v".indexOf(map[r][c]) > -1) {
        const cart = new Cart(cartId++, r, c, map[r][c]);
        carts.push(cart);
        fillBlank(r, c);
      }
    }
  }
  let collision = false;
  let counter = 0;
  while (!collision) {
    counter++;
    carts.sort((a, b) => byPriority(a, b));

    newCarts = [];
    for (const cart of carts) {
      cart.advance();
      if (checkCollision(cart, carts)) {
        crashLocation = `${cart.col},${cart.row}`;

        collision = true;
        break;
      }
    }
  }

  return crashLocation;
}

function partTwo(input) {
  let lastCartStanding = '';

  let carts = [];
  map = [];

  for (const line of input) {
    map.push(Array.from(line));
  }

  let cartId = 1;
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if ("<>^v".indexOf(map[r][c]) > -1) {
        const cart = new Cart(cartId++, r, c, map[r][c]);
        carts.push(cart);
        fillBlank(r, c);
      }
    }
  }

  let collision = false;
  let counter = 0;
  while (!collision) {
    counter++;
    carts.sort((a, b) => byPriority(a, b));

    newCarts = [];
    for (const cart of carts) {
      cart.advance();
      checkCollision(cart, carts);
    }
    carts = carts.filter((x) => !x.crashed);
    if (carts.length == 1) {
      lastCartStanding = `${carts[0].col},${carts[0].row}`;
      collision = true;
    }
    if (carts.length <1){
      // this is here for sample.txt to exit
      collision = true;
    }
  }

  return lastCartStanding;
  let tally = 0;

  return tally;
}

function checkCollision(cart, carts) {
  const c = carts.filter((x) => x.row == cart.row && x.col == cart.col);
  if (c.length > 1) {
    c[0].crashed = true;
    c[1].crashed = true;
  }
  return c.length > 1;
}

function byPriority(a, b) {
  return a.priority() - b.priority();
}

function fillBlank(r, c) {
  if ("<>".indexOf(map[r][c]) > -1) {
    map[r][c] = "-";
  } else {
    map[r][c] = "|";
  }
}

function printMap(carts) {
  const arr = [];
  for (let i = 0; i < height; i++) {
    arr[i] = map[i].slice();
  }
  for (const c of carts) {
    arr[c.row][c.col] = dirKeys[c.dir];
  }
  arr.forEach((row) => console.log(...row));
}

function solveFile(filePath) {
  map = [];
  height = 0;
  width = 0;

  var input = fs.readFileSync(filePath).toString().split("\n");
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
