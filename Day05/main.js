const fs = require("fs");
const { performance } = require("perf_hooks");
const { Stack } = require("../Utils/Stack.js");

const title = "## Day 5: Alchemical Reduction ##"
const url = "https://adventofcode.com/2018/day/5"

let partOneResult = 0;

function partOne(data){

  const input = data.split('').map(x => x.charCodeAt());
  const polymer = new Stack();
  polymer.push(input[0]);
  
  let next = 1;
  while(next < input.length){
    if (Math.abs(polymer.peek() - input[next]) == 32){
      polymer.pop();
      next += 1;
      if (polymer.isEmpty()){
        polymer.push(input[next])
        next += 1;
      }
    }
    else{
      polymer.push(input[next]);
      next += 1;
    }
  }

  partOneResult = polymer.size();
  return partOneResult;
}

function partTwo(data){
  const input = data.split('').map(x => x.charCodeAt());
  let minPoly = partOneResult;
  for (var i = 0; i < 26; i++){
    const arr = input.slice().filter(x => x != 'a'.charCodeAt() + i && x != 'A'.charCodeAt() + i);
    const polymer = new Stack();
    polymer.push(arr[0]);

    let next = 1;
    while(next < arr.length){
      if (Math.abs(polymer.peek() - arr[next]) == 32){
        polymer.pop();
        next += 1;
        if (polymer.isEmpty()){
          polymer.push(arr[next])
          next += 1;
        }
      }
      else{
        polymer.push(arr[next]);
        next += 1;
      }
    }

    minPoly = Math.min(minPoly, polymer.size());
  }

  return minPoly;
}

function solveFile(filePath){
  var input = fs.readFileSync(filePath).toString().trim();
  console.log(`\nFile: ${filePath}`)
  
  let start = performance.now();
  const result1 = partOne(input);
  const mid = performance.now();
  console.log(`Part 1 result: ${result1} in ${(mid - start).toPrecision(6)}ms`)

  start = performance.now();
  const result2 = partTwo(input);
  const end = performance.now();

  console.log(`Part 2 result: ${result2} in ${(end - start).toPrecision(6)}ms`)
}

console.log(title)
console.log(url)
for (let filePath of process.argv.slice(2)){
  solveFile(filePath);
}
