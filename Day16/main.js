const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

const title = "## Day 16: Chronal Classification ##"
const url = "https://adventofcode.com/2018/day/16"

const A = 0;
const B = 1;
const C = 2;
let register = [0, 0, 0, 0];

let samples = [];
const opcodes = new Array(16);
const funcs = [ addr, addi, mulr, muli, banr, bani, borr, bori,
                setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr];

function partOne(input) {
  samples = input.trim().split("\n");

  let tally = 0;
  
  let idx = 0;
  while (idx < samples.length) {
    const {before, current, after} = getData(idx);
    const {opcode, a, b, c} = getValues(current);
    
    counter = 0;
    for (const fn of funcs){
      register = before.slice();

      fn(a, b, c);
      
      if (register.join('') == after.join('')){
        counter++;
      }
    }
    
    if (counter >= 3){
      tally++;
    }
    idx += 4; 
  }

  return tally;
}

function partTwo(input) {
  const found = new Set();

  let idx = 0;
  while (funcs.length > 0 && idx < samples.length) {
    const {before, current, after} = getData(idx);
    const {opcode, a, b, c} = getValues(current);

    if (found.has(opcode)){
      idx += 4;
      continue;
    }

    counter = 0;
    let lastFuncIndex = -1;

    for (let i = 0; i < funcs.length; i++){
      register = before.slice();

      // execute instruction
      funcs[i](a, b, c);
      
      if (register.join('') == after.join('')){
        lastFuncIndex = i;
        counter++;
      }
    }

    if (counter == 1){
      opcodes[opcode] = funcs[lastFuncIndex];
      found.add(opcode);
      funcs.splice(lastFuncIndex, 1);
      idx = 0;
      continue;
    }

    idx += 4; 
  }

  if (funcs.length > 0){
    return `Something went wrong. Funcs left:${funcs.length}`;
  }

  const testProgram = input.split('\n').map(x => x.split(' ').map(Number));
  register = [0,0,0,0];
  for (const instruction of testProgram){
    execute(instruction);
  }

  return register[0];
}

function execute(instruction){
    const {opcode, a, b, c} = getValues(instruction);
    opcodes[opcode](a,b,c);
}

function getValues(arr){
  return { opcode:arr[0], a:arr[1], b:arr[2], c:arr[3] };
}

function getData(idx){
  const str1 = samples[idx].match(/\d+/g).map(Number);
  const str2 = samples[idx + 1].split(" ").map(Number);
  const str3 = samples[idx + 2].match(/\d+/g).map(Number);
    
  assert(
    str1.length == 4 && str2.length == 4 && str3.length == 4, 
    `Did not find enough instruction values. Before:${str1.length}, Current: ${str2.length}, After:${str3.length}`
  );

  return {before:str1, current:str2, after:str3};
}

function addr(a, b, c) {
  register[c] = register[a] + register[b];
}

function addi(a, b, c) {
  register[c] = register[a] + b;
}

function mulr(a, b, c) {
  register[c] = register[a] * register[b];
}

function muli(a, b, c) {
  register[c] = register[a] * b;
}

function banr(a, b, c) {
  register[c] = register[a] & register[b];
}

function bani(a, b, c) {
  register[c] = register[a] & b;
}

function borr(a, b, c) {
  register[c] = register[a] | register[b];
}

function bori(a, b, c) {
  register[c] = register[a] | b;
}

function setr(a, b, c) {
  register[c] = register[a];
}

function seti(a, b, c) {
  register[c] = a;
}

function gtir(a, b, c) {
  register[c] = a > register[b] ? 1 : 0;
}

function gtri(a, b, c) {
  register[c] = register[a] > b ? 1 : 0;
}

function gtrr(a, b, c) {
  register[c] = register[a] > register[b] ? 1 : 0;
}

function eqir(a, b, c) {
  register[c] = a == register[b] ? 1 : 0;
}

function eqri(a, b, c) {
  register[c] = register[a] == b ? 1 : 0;
}

function eqrr(a, b, c) {
  register[c] = register[a] == register[b] ? 1 : 0;
}

function solveFile(filePath) {
  var input = fs.readFileSync(filePath).toString().trim().split("\n\n\n\n");
  console.log(`\nFile: ${filePath}`);

  assert(
    input.length == 2,
    `Unexpected file input format. Length:${input.length}`,
  );
  let start = performance.now();
  const result1 = partOne(input[0]);
  const mid = performance.now();
  console.log(`Part 1 result: ${result1} in ${(mid - start).toPrecision(6)}ms`);

  start = performance.now();
  const result2 = partTwo(input[1]);
  const end = performance.now();

  console.log(`Part 2 result: ${result2} in ${(end - start).toPrecision(6)}ms`);
}

console.log(title)
console.log(url)
for (let filePath of process.argv.slice(2)) {
  solveFile(filePath);
}
