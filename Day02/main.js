const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

const title = "## Day 2: Inventory Management System ##"
const url = "https://adventofcode.com/2018/day/2"

function partOne(lines){
  let threes = 0;
  let twos = 0;
  for (const line of lines){
    const dictionary = new Object();
    let hasTwos = false;
    let hasThrees = false;
    for (const ch of line){
      if (dictionary[ch] > 0){
        dictionary[ch] += 1;
      }
      else {
        dictionary[ch] = 1;
      }
    }
    if (Object.values(dictionary).includes(2)){
      twos += 1;
    }
    if (Object.values(dictionary).includes(3)){
      threes += 1;
    }
  }
  let result = 0;
  return twos * threes;
}

function partTwo(lines){
  let index = findCorrectBoxIds(lines);

  if (index.boxId1 == '' || index.boxId2 == ''){
    console.log(`Box Ids not found`);
    return 0;
  }

  return getCommonLetters(index.boxId1, index.boxId2);
}

function findCorrectBoxIds(lines){
  for (let i = 0; i < lines.length - 1; i++){
    for (let j = 1; j < lines.length; j++){
      if (i == j) continue;
      let diffs = 0;
      for (let k = 0; k < lines[i].length; k++){
        if (lines[i][k] != lines[j][k]){
          diffs += 1;
        }
        if (diffs > 1) break;
      }
      if (diffs == 1){
        return {boxId1: lines[i], boxId2: lines[j]};
      }
    }
  }

  return {boxId1: '', boxId2: ''};
}

function getCommonLetters(first, second){

  const commonLtrs = [];
  for (let k = 0; k < first.length; k++){
    if (first[k] == second[k]){
      commonLtrs.push(first[k]);
    }
  }

  return Array.from(commonLtrs);
}

function solveFile(filePath){
  var lines = fs.readFileSync(filePath).toString().trim().split('\n');
  console.log(`\nFile: ${filePath}`)
  
  let start = performance.now();
  const result1 = partOne(lines);
  const mid = performance.now();
  console.log(`Part 1 result: ${result1} in ${(mid - start).toPrecision(6)}ms`)

  start = performance.now();
  const result2 = partTwo(lines);
  const end = performance.now();
  const arr = Array.from(result2).sort();

  console.log(`Part 2 result: ${result2.join('')} in ${(end - start).toPrecision(6)}ms`)
}

console.log(title)
console.log(url)
for (let filePath of process.argv.slice(2)){
  solveFile(filePath);
}
