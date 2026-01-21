const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

let elf1 = 0;
let elf2 = 1;
const recipes = [3, 7];

function partOne() {
  const input = [5, 9, 18, 2018, 702831];
  const maxRecipes = Math.max(...input) + 10;

  //printRecipes(elf1, elf2, recipes);
  while (recipes.length < maxRecipes) {
    let newValue = recipes[elf1] + recipes[elf2] + "";
    recipes.push(...newValue.split("").map(Number));

    elf1 = (elf1 + recipes[elf1] + 1) % recipes.length;
    elf2 = (elf2 + recipes[elf2] + 1) % recipes.length;
    //printRecipes(elf1, elf2, recipes);
  }

  let scores = "";
  for (const max of input) {
    var arr = recipes.slice(max, max + 10);
    scores = arr.join("");
    console.log(`For ${max} recipes, scores: ${scores}`);
  }

  return scores;
}

function partTwo() {
  let input = "515891";
  //input = "012451";
  //input = "925107";
  //input = "594142";
  //input = "113241";
  input = "702831";

  target = input.split("").map(Number);

  let idx = 0;
  while (idx < recipes.length - 5) {
    if (checkValue(idx, target)) {
      return idx;
    }
    idx++;
  }

  // not found in existing recipes, so add more
  // until the target is found.
  while (true) {
    let i = 0;
    while (i++ < 1000000) {
      let newValue = recipes[elf1] + recipes[elf2] + "";
      recipes.push(...newValue.split("").map(Number));

      elf1 = (elf1 + recipes[elf1] + 1) % recipes.length;
      elf2 = (elf2 + recipes[elf2] + 1) % recipes.length;
    }
    while (idx < recipes.length - 5) {
      if (checkValue(idx, target)) {
        return idx;
      }
      idx++;
    }
  }

  return 0;
}

function checkValue(idx, target) {
  if (recipes[idx] == target[0]) {
    if (recipes[idx + 1] == target[1]) {
      if (recipes[idx + 2] == target[2]) {
        if (recipes[idx + 3] == target[3]) {
          if (recipes[idx + 4] == target[4]) {
            if (recipes[idx + 5] == target[5]) {
              // success
              return true;
            }
          }
        }
      }
    }
  }
  return false;
}

function printRecipes(elf1, elf2, recipes) {
  let ptrStr = "";
  for (let i = 0; i < recipes.length; i++) {
    if (i == elf1) {
      ptrStr += "(" + recipes[i] + ")";
    } else if (i == elf2) {
      ptrStr += "[" + recipes[i] + "]";
    } else {
      ptrStr += " " + recipes[i] + " ";
    }
  }
  console.log(ptrStr);
}

function solveFile(filePath) {
  var input = fs.readFileSync(filePath).toString().trim();
  console.log(`\nFile: ${filePath}`);

  let start = performance.now();
  const result1 = partOne();
  const mid = performance.now();
  console.log(`Part 1 result: ${result1} in ${(mid - start).toPrecision(6)}ms`);

  start = performance.now();
  const result2 = partTwo();
  const end = performance.now();

  console.log(`Part 2 result: ${result2} in ${(end - start).toPrecision(6)}ms`);
}

for (let filePath of process.argv.slice(2)) {
  solveFile(filePath);
}

return 0;
