const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");
const { PriorityQueue } = require("../Utils/Queue.js");

const title = "## Day 7: The Sum of Its Parts ##"
const url = "https://adventofcode.com/2018/day/7"

function processInput(input) {
  const re = /Step (\w) must be finished before step (\w) can begin./i;

  const blockedBy = new Object();
  const blocking = new Object();

  for (const line of input) {
    const m = line.match(re);
    if (blocking[m[1]] === undefined) {
      blocking[m[1]] = [m[2]];
    } else {
      blocking[m[1]].push(m[2]);
    }
    if (blockedBy[m[2]] === undefined) {
      blockedBy[m[2]] = [m[1]];
    } else {
      blockedBy[m[2]].push(m[1]);
    }
  }

  return { blocking: blocking, blocked: blockedBy };
}

function partOne(input) {
  const data = processInput(input);
  const blockedBy = data.blocked;
  const blocking = data.blocking;

  const blockedKeys = Object.keys(blockedBy);
  const blockingKeys = Object.keys(blocking);
  const q = new PriorityQueue();

  for (const ch of blockingKeys) {
    if (!blockedKeys.includes(ch)) {
      q.enqueue(ch, ch.charCodeAt(0));
    }
  }

  const steps = [];
  while (!q.isEmpty()) {
    const ch = q.dequeue();
    if (ch == "Queue is Empty") {
      break;
    }

    steps.push(ch.node);
    if (blocking[ch.node] === undefined) {
      continue;
    }
    for (const k of blocking[ch.node]) {
      blockedBy[k] = blockedBy[k].filter((x) => x != ch.node);
      if (blockedBy[k].length == 0) {
        q.enqueue(k, k.charCodeAt(0));
        delete blockedBy[k];
      }
    }
  }

  return steps.join("");
}

function partTwo(input) {
  let workers = [];
  // for the sample.txt set these to the following:
  //const workersCount = 2;
  //const stepDuration = 0;
  const workersCount = 5;
  const stepDuration = 60;
  const offset = "A".charCodeAt(0) - 1;

  const data = processInput(input);
  const blockedBy = data.blocked;
  const blocking = data.blocking;

  const blockedKeys = Object.keys(blockedBy);
  const blockingKeys = Object.keys(blocking);
  const q = new PriorityQueue();

  for (const ch of blockingKeys) {
    if (!blockedKeys.includes(ch)) {
      q.enqueue(ch, ch.charCodeAt(0) - offset);
    }
  }

  const steps = [];
  let timeStamp = 0;
  let workersBusy = false;

  while (!q.isEmpty() || workersBusy) {
    if (workersBusy) {
      // console.log(
      //   `Second: ${timeStamp}, ` +
      //     `Worker 1: ${workers[0] === undefined ? "." : workers[0].ch + "(" + workers[0].time +")" }, ` +
      //     `Worker 2: ${workers[1] === undefined ? "." : workers[1].ch + "(" + workers[1].time +")" }, ` +
      //     `Worker 3: ${workers[2] === undefined ? "." : workers[2].ch + "(" + workers[2].time +")" }, ` +
      //     `Worker 4: ${workers[3] === undefined ? "." : workers[3].ch + "(" + workers[3].time +")" }, ` +
      //     `Worker 5: ${workers[4] === undefined ? "." : workers[4].ch + "(" + workers[4].time +")" }, ` +
      //     `Done: ${steps}`,
      // );
      timeStamp += 1;
    }

    for (const worker of workers) {
      worker.time -= 1;
      if (worker.time == 0) {
        const ch = worker.ch;
        steps.push(ch);
        if (blocking[ch] === undefined) {
          continue;
        }
        for (const k of blocking[ch]) {
          blockedBy[k] = blockedBy[k].filter((x) => x != ch);
          if (blockedBy[k].length == 0) {
            q.enqueue(k, k.charCodeAt(0) - offset);
            delete blockedBy[k];
          }
        }
      }
    }

    workers = workers.filter((x) => x.time > 0);

    while (!q.isEmpty() && workers.length < workersCount) {
      const item = q.dequeue();
      if (item == "Queue is Empty") {
        throw new Error("Queue was unexpectedly empty");
        break;
      }
      const t = stepDuration + item.priority;
      const ch = item.node;
      workers.push({ ch: ch, time: t });
    }

    workersBusy = workers.length > 0;
  }

  return timeStamp;
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
