const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

class PotNode {
  constructor(value, index) {
    this.value = value;
    this.new_value = null;
    this.index = index;
    this.prev = null;
    this.next = null;
  }

  movePrev(n) {
    let current = this;
    while (n-- > 0) {
      if (current.prev == null) {
        return "Error";
      }
      current = current.prev;
    }
    return current;
  }

  moveNext(n) {
    let current = this;
    while (n-- > 0) {
      if (current.next == null) {
        return "Error";
      }
      current = current.next;
    }
    return current;
  }

  canGetPattern() {
    let current = this;
    if (current.moveNext(2) == "Error") {
      return false;
    }
    if (current.movePrev(2) == "Error") {
      return false;
    }
    return true;
  }

  getPattern() {
    let current = this;
    current = current.movePrev(2);
    let n = 5;
    let pattern = "";
    while (n-- > 0) {
      pattern += current.value;
      current = current.next;
    }
    return pattern;
  }

  normalize() {
    let current = this;
    let sinceLastPlant = 0;

    while (current.prev != null) {
      current = current.prev;
      sinceLastPlant = current.value == "#" ? 0 : sinceLastPlant + 1;
    }

    while (sinceLastPlant < 5) {
      const new_node = new PotNode(".", current.index - 1);
      current.prev = new_node;
      new_node.next = current;
      current = new_node;
      sinceLastPlant++;
    }

    while (current.next != null) {
      current = current.next;
      sinceLastPlant = current.value == "#" ? 0 : sinceLastPlant + 1;
    }

    while (sinceLastPlant < 5) {
      const new_node = new PotNode(".", current.index + 1);
      current.next = new_node;
      new_node.prev = current;
      current = new_node;
      sinceLastPlant++;
    }
  }

  update() {
    let cur = this;
    while (cur.prev != null) {
      cur = cur.prev;
    }
    while (cur.next != null) {
      cur.value = cur.new_value == null ? "." : cur.new_value;
      cur = cur.next;
    }
  }

  getCount() {
    let current = this;
    while (current.prev != null) {
      current = current.prev;
    }
    let count = 0;
    while (current != null) {
      if (current.value == "#") {
        count += current.index;
      }
      current = current.next;
    }
    return count;
  }

  toString() {
    let current = this;
    while (current.prev != null) {
      current = current.prev;
    }
    let str = "";
    while (current != null) {
      if (current.index == 0) {
        str += "(" + current.value + ")";
      } else {
        str += current.value;
      }
      current = current.next;
    }
    return str;
  }
}

function create(input) {
  const head = new PotNode(input[0], 0);
  let current = head;

  for (let i = 1; i < input.length; i++) {
    const new_node = new PotNode(input[i], i);
    current.next = new_node;
    new_node.prev = current;
    current = new_node;
  }

  head.normalize();

  return head;
}

function getStartNode(node) {
  while (node.prev != null) {
    node = node.prev;
  }
  node = node.moveNext(2);
  return node;
}

function getCombos(input) {
  const data = input
    .trim()
    .split("\n")
    .map((x) => {
      let pair = x.split(" => ");
      return { pattern: pair[0], result: pair[1] };
    });
  const combos = new Object();
  for (const c of data) {
    combos[c.pattern] = c.result;
  }
  return combos;
}

function partOne(input) {
  let generations = 20;
  const initialState = input[0].split(": ")[1].trim();
  const combos = getCombos(input[1]);

  const head = create(initialState);

  for (let gen = 1; gen <= generations; gen++) {
    let current = getStartNode(head);
    while (current.canGetPattern()) {
      const ch = combos[current.getPattern()];
      if (ch == "#") {
        current.new_value = "#";
      } else {
        current.new_value = ".";
      }
      current = current.next;
    }
    head.update();
    head.normalize();
  }

  return head.getCount();
}

function partTwo(input) {
  let generations = 120;
  const initialState = input[0].split(": ")[1].trim();
  const combos = getCombos(input[1]);

  const head = create(initialState);
  let totalAt89 = 0;

  //console.log(`00: ${head.toString()}`);

  for (let gen = 1; gen <= generations; gen++) {
    let current = getStartNode(head);
    while (current.canGetPattern()) {
      const ch = combos[current.getPattern()];
      if (ch == "#") {
        current.new_value = "#";
      } else {
        current.new_value = ".";
      }
      current = current.next;
    }
    head.update();
    head.normalize();
    // console.log(
    //   `${gen < 100 ? '0' + gen : gen}: Count:${head.getCount()} ${head.toString()}`,
    // );
  }

  return head.getCount() + (50000000000 - 89) * 50;
}

function solveFile(filePath) {
  var input = fs.readFileSync(filePath).toString().trim().split("\n\n");
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
