const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

let head = 0;

class Node {
  constructor(metaData) {
    this.value = 0;
    this.metaData = metaData;
    this.children = [];
  }
}

function createNodeTree(data, parent) {
  if (data.length > 1) {
    const childrenCount = data[0];
    const metaDataCount = data[1];

    data = data.slice(2);

    const current = new Node([]);
    if (parent === undefined) {
      head = current;
    } else {
      parent.children.push(current);
    }

    for (let i = 0; i < childrenCount; i++) {
      data = createNodeTree(data, current);
    }

    current.metaData = data.slice(0, metaDataCount);
    data = data.slice(metaDataCount);
  }

  return data;
}

function treeTotal(node) {
  let total = node.metaData.reduce((acc, curr) => acc + curr, 0);

  if (node.children.length == 0) {
    return total;
  }

  for (const child of node.children) {
    total += treeTotal(child);
  }

  return total;
}

function calcTreeValues(node) {
  if (node.children.length > 0) {
    for (let child of node.children) {
      calcTreeValues(child);
    }
    let value = 0;
    for (let idx of node.metaData) {
      idx -= 1;
      if (node.children[idx] === undefined) {
        continue;
      }
      value += node.children[idx].value;
    }
    node.value = value;
  } else {
    node.value = node.metaData.reduce((acc, curr) => acc + curr, 0);
  }
}

function partOne(input) {
  createNodeTree(input);

  return treeTotal(head);
}

function partTwo(input) {
  calcTreeValues(head);

  return head.value;
}

function solveFile(filePath) {
  var input = fs
    .readFileSync(filePath)
    .toString()
    .trim()
    .split(" ")
    .map(Number);
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
