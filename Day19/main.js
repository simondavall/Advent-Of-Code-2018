const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");
const { Device, Instruction } = require("../Device/opcodes.js");

const title = "## Day 19: Go With The Flow ##"
const url = "https://adventofcode.com/2018/day/19"

function partOne(input) {
  const register = [0, 0, 0, 0, 0, 0];
  const data = input[0].split(" ");
  assert(
    data.length == 2,
    `First line length should be 2. Value:'${data.length}'`,
  );
  const ipReg = +data[1];

  const instructions = [];
  const regEx = /(\w+)\s(\d+)\s(\d+)\s(\d+)/;
  for (const line of input.slice(1)) {
    const m = line.match(regEx);
    instructions.push(new Instruction(m[1], +m[2], +m[3], +m[4]));
  }

  const device = new Device(ipReg, register);
  let ip = 0;
  while (ip < instructions.length) {
    const instruction = instructions[ip];
    // let str = `ip=${ip} [${device.register}] ${instruction.toString()} [`;
    device.execute(instruction);
    // str += device.register + "]";
    // console.log(str);
    ip = device.getIP();
  }

  return device.register[0];
}

function partTwo(input) {
  // Part two runs indefinitely.
  // See playtime.txt for annotation of assembly
  //
  // In summary the assembly sums the factors of 10551300
  // but takes forever.
  //
  // Here is a formula that calcs the factors much quicker.

  const factorsOf = (number) => Array
    .from(Array(number + 1), (_, i) => i)
    .filter((i) => number % i === 0);

  const arr = factorsOf(10551300);

  return arr.reduce((a, b) => a + b);
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
