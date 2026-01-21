const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

const title = "## Day 22: Mode Maze ##"
const url = "https://adventofcode.com/2018/day/22"

class searchNode {
  constructor(x, y, tool) {
    this.x = x;
    this.y = y;
    this.tool = tool;
    this.connectionsWithCost = new Object();
  }
  getKey() {
    return `${this.x}-${this.y}-${this.tool}`;
  }
}

class discoveryTimer {
  constructor(searchNode, targetCost) {
    this.searchNode = searchNode;
    this.targetCost = targetCost;
    this.ticks = 6;
  }
}

const tool = { neither: 0, torch: 1, climbing: 2 };

function partOne(targetX, targetY, depth) {
  const types = new Object();
  const geoIndices = new Object();
  const erosionLevels = new Object();
  let riskLevel = 0;

  let regions = new Object();
  regions[`0-0`] = { x: 0, y: 0 };

  while (Object.values(regions).length > 0) {
    const new_regions = new Object();

    for (const { x, y } of Object.values(regions)) {
      let geoIndex = 0;
      if (x == 0 && y == 0) { geoIndex = 0; }
      else if (x == targetX && y == targetY) { geoIndex = 0; } 
      else if (y == 0) { geoIndex = x * 16807; } 
      else if (x == 0) { geoIndex = y * 48271; }
      else {
        const key1 = getKey(x - 1, y);
        const key2 = getKey(x, y - 1);
        geoIndex = erosionLevels[key1] * erosionLevels[key2];
      }

      const key = getKey(x, y);
      geoIndices[key] = geoIndex;
      erosionLevels[key] = (geoIndex + depth) % 20183;
      types[key] = erosionLevels[key] % 3;

      riskLevel += types[key];

      if (x < targetX) new_regions[`${x + 1}-${y}`] = { x: x + 1, y: y };
      if (y < targetY) new_regions[`${x}-${y + 1}`] = { x: x, y: y + 1 };
    }
    regions = new_regions;
  }

  return riskLevel;
}

function partTwo(targetX, targetY, depth) {
  // add some leeway for a path outside the box
  const maxX = targetX + 30;
  const maxY = targetY + 30;

  const types = new Object();
  const geoIndices = new Object();
  const erosionLevels = new Object();

  let regions = new Object();
  regions[`0-0`] = { x: 0, y: 0 };

  const searchNodes = new Object();
  const lookup = new Object();

  while (Object.values(regions).length > 0) {
    const new_regions = new Object();

    for (const { x, y } of Object.values(regions)) {
      let geoIndex = 0;
      if (x == 0 && y == 0) { geoIndex = 0; }
      else if (x == targetX && y == targetY) { geoIndex = 0; } 
      else if (y == 0) { geoIndex = x * 16807; } 
      else if (x == 0) { geoIndex = y * 48271; }
      else {
        const key1 = getKey(x - 1, y);
        const key2 = getKey(x, y - 1);
        geoIndex = erosionLevels[key1] * erosionLevels[key2];
      }

      const key = getKey(x, y);
      geoIndices[key] = geoIndex;
      erosionLevels[key] = (geoIndex + depth) % 20183;
      types[key] = erosionLevels[key] % 3;

      if (x < maxX - 1) new_regions[`${x + 1}-${y}`] = { x: x + 1, y: y };
      if (y < maxY - 1) new_regions[`${x}-${y + 1}`] = { x: x, y: y + 1 };

      const options = new Object();
      const point = { x: x, y: y };

      if (types[key] == 0) {
        options[getKey(x, y, tool.climbing)] = new searchNode(x, y, tool.climbing);
        options[getKey(x, y, tool.torch)] = new searchNode(x, y, tool.torch);
      } else if (types[key] == 1) {
        options[getKey(x, y, tool.climbing)] = new searchNode(x, y, tool.climbing);
        options[getKey(x, y, tool.neither)] = new searchNode(x, y, tool.neither);
      } else if (types[key] == 2) {
        options[getKey(x, y, tool.torch)] = new searchNode(x, y, tool.torch);
        options[getKey(x, y, tool.neither)] = new searchNode(x, y, tool.neither);
      }

      const optionValues = Object.values(options);
      for (const opt of optionValues) {
        const optKey = getKey(opt.x, opt.y, opt.tool);
        lookup[optKey] = opt;

        searchNodes[optKey] = opt;
        assert(optionValues.length == 2, `Options length should be 2. Length:${optionValues.length}`);
        const otherOpt = optionValues.filter((o) => o.tool != opt.tool)[0];
        const otherOptKey = getKey(otherOpt.x, otherOpt.y, otherOpt.tool);
        opt.connectionsWithCost[otherOptKey] = { option: otherOpt, cost: 7 };

        const left = getKey(x, y - 1, opt.tool);
        const up = getKey(x - 1, y, opt.tool);

        const reach1 = lookup[left];
        if (reach1 !== undefined) {
          const reach1Key = getKey(reach1.x, reach1.y, reach1.tool);
          opt.connectionsWithCost[reach1Key] = { option: reach1, cost: 1 };
          reach1.connectionsWithCost[optKey] = { option: opt, cost: 1 };
        }

        const reach2 = lookup[up];

        if (reach2 !== undefined) {
          const reach2Key = getKey(reach2.x, reach2.y, reach2.tool);
          opt.connectionsWithCost[reach2Key] = { option: reach2, cost: 1 };
          reach2.connectionsWithCost[optKey] = { option: opt, cost: 1 };
        }
      }
    }
    regions = new_regions;
  }

  return getMinDistance(searchNodes, {x:0, y:0}, {x:targetX, y:targetY});
}

function getMinDistance(searchNodes, originPoint, targetPoint) {
  const origin = searchNodes[getKey(originPoint.x, originPoint.y, tool.torch)];
  const target = searchNodes[getKey(targetPoint.x, targetPoint.y, tool.torch)];

  const visited = new Object();
  let edges = new Object();
  edges[origin.getKey()] = origin;
  const distances = new Object();
  const discoveryTimers = [];

  while (Object.values(edges).length > 0 || discoveryTimers.length > 0) {
    const new_edges = new Object();

    for (let i = discoveryTimers.length - 1; i >= 0; i--) {
      const timer = discoveryTimers[i];
      timer.ticks--;
      if (timer.ticks == 0) {
        let distance = distances[timer.searchNode.getKey()];
        distance = distance !== undefined ? distance : 999999999;
        distances[timer.searchNode.getKey()] = Math.min(
          timer.targetCost,
          distance,
        );
        new_edges[timer.searchNode.getKey()] = timer.searchNode;
        discoveryTimers.splice(i, 1);
      }
    }

    for (const edge of Object.values(edges)) {
      if (visited[edge.getKey()]) {
        continue;
      }
      visited[edge.getKey()] = true;

      for (const opt of Object.values(edge.connectionsWithCost)) {
        if (opt.cost == 1) {
          let distance = distances[opt.option.getKey()];
          distance = distance !== undefined ? distance : 999999999;

          if (distances[edge.getKey()] === undefined){
            distances[edge.getKey()] = 0;
          }
          distances[opt.option.getKey()] = Math.min(distances[edge.getKey()] + 1, distance);
          new_edges[opt.option.getKey()] = opt.option;
        } else {
          discoveryTimers.push(
            new discoveryTimer(opt.option, distances[edge.getKey()] + 7),
          );
        }
      }
    }
    edges = new_edges;
  }

  return distances[target.getKey()];
}

function getKey(x, y, tool) {
  return `${x}-${y}-${tool}`;
}

function solveFile(filePath) {
  var input = fs.readFileSync(filePath).toString().trim().split("\n");
  console.log(`\nFile: ${filePath}`);

  const depth = +input[0].split(" ")[1];
  const arr = input[1].split(" ")[1].split(",");
  const targetX = +arr[0];
  const targetY = +arr[1];

  let start = performance.now();
  const result1 = partOne(targetX, targetY, depth);
  const mid = performance.now();
  console.log(`Part 1 result: ${result1} in ${(mid - start).toPrecision(6)}ms`);

  start = performance.now();
  const result2 = partTwo(targetX, targetY, depth);
  const end = performance.now();

  console.log(`Part 2 result: ${result2} in ${(end - start).toPrecision(6)}ms`);
}

console.log(title)
console.log(url)
for (let filePath of process.argv.slice(2)) {
  solveFile(filePath);
}
