const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

const title = "## Day 21: Chronal Conversion ##"
const url = "https://adventofcode.com/2018/day/21"

function partOne(input){
let r0 = 0;
let r1 = 0;
let r2 = 0;
let r3 = 0;
let r4 = 0;
let r5 = 0;

  while (r1 < input.length){

    switch (r1){
      case 0: r4 = 123;                     break;
      case 1: r4 = r4 & 456;                break;
      case 2: r4 = boolToInt(r4 == 72);     break;
      case 3: r1 = r4 + r1;                 break;
      case 4: r1 = 0;                       break;
      case 5: r4 = 0;                       break;
      case 6: r3 = r4 | 65536;              break;
      case 7: r4 = 12670166;                break;
      case 8: r2 = r3 & 255;                break;
      case 9: r4 = r4 + r2;                 break;
      case 10: r4 = r4 & 16777215;          break;
      case 11: r4 = r4 * 65899;             break;
      case 12: r4 = r4 & 16777215;          break;
      case 13: r2 = boolToInt(256 > r3);    break;
      case 14: r1 = r2 + r1;                break;
      case 15: r1 = r1 + 1;                 break;
      case 16: r1 = 27;                     break;
      case 17: r2 = 0;                      break;
      case 18: r5 = r2 + 1;                 break;
      case 19: r5 = r5 * 256;               break;
      case 20: r5 = boolToInt(r5 > r3);     break;
      case 21: r1 = r5 + r1;                break;
      case 22: r1 = r1 + 1;                 break;
      case 23: r1 = 25;                     break;
      case 24: r2 = r2 + 1;                 break;
      case 25: r1 = 17;                     break;
      case 26: r3 = r2;                     break;
      case 27: r1 = 7;                      break;
      case 28: 
        return r4;
        r2 = boolToInt(r4 == r0);           break;
      case 29: r1 = r2 + r1;                break;
      case 30: r1 = 5;                      break;
    }
    r1 += 1;
  }

  return -1;
}

function boolToInt(expr){
  if (expr){
    return 1;
  }
  return 0;
}

function partTwo(input) {
const seen = new Object();
let lastValue = -1;
let r0 = 0;
let r1 = 0;
let r2 = 0;
let r3 = 0;
let r4 = 0;
let r5 = 0;
let foundRepeat = false;

  while (!foundRepeat){

    switch (r1){
      case 0: r4 = 123;                     break;
      case 1: r4 = r4 & 456;                break;
      case 2: r4 = boolToInt(r4 == 72);     break;
      case 3: r1 = r4 + r1;                 break;
      case 4: r1 = 0;                       break;
      case 5: r4 = 0;                       break;
      case 6: r3 = r4 | 65536;              break;
      case 7: r4 = 12670166;                break;
      case 8: r2 = r3 & 255;                break;
      case 9: r4 = r4 + r2;                 break;
      case 10: r4 = r4 & 16777215;          break;
      case 11: r4 = r4 * 65899;             break;
      case 12: r4 = r4 & 16777215;          break;
      case 13: r2 = boolToInt(256 > r3);    break;
      case 14: r1 = r2 + r1;                break;
      case 15: r1 = r1 + 1;                 break;
      case 16: r1 = 27;                     break;
      case 17: r2 = 0;                      break;
      case 18: r5 = r2 + 1;                 break;
      case 19: r5 = r5 * 256;               break;
      case 20: r5 = boolToInt(r5 > r3);     break;
      case 21: r1 = r5 + r1;                break;
      case 22: r1 = r1 + 1;                 break;
      case 23: r1 = 25;                     break;
      case 24: r2 = r2 + 1;                 break;
      case 25: r1 = 17;                     break;
      case 26: r3 = r2;                     break;
      case 27: r1 = 7;                      break;
      case 28:
        if (seen[r4]){
          foundRepeat = true;
          break;
        }
        seen[r4] = true;
        lastValue = r4;
        r2 = boolToInt(r4 == r0);           break;
      case 29: r1 = r2 + r1;                break;
      case 30: r1 = 5;                      break;
    }
    r1 += 1;
  }

  return lastValue;
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
