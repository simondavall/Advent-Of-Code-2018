const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");
const { Queue } = require("../Utils/Queue.js");

const title = "## Day 6: Chronal Coordinates ##"
const url = "https://adventofcode.com/2018/day/6"

const directions = [{dx:0,dy:1},{dx:1,dy:0},{dx:0,dy:-1},{dx:-1,dy:0}];

function partOne(points){

  // find max/min x/y
  let minX = 9999, maxX = -1;
  let minY = 9999, maxY = -1;

  for (let i = 0; i < points.length; i++){
    const x = points[i].x;
    const y = points[i].y;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const offsetX = minX;
  const offsetY = minY;

  let inc = 0;
  const edgePoints = new Set();
  const pointCount = new Array(points.length);
  pointCount.fill(0);

  for (let x = minX; x <= maxX; x++){
    for (let y = minY; y <= maxY; y++){
      let minDistPts = [];

      let minDist = 9999;
      for (let pt = 0; pt < points.length; pt++){
        const dist = Math.abs(points[pt].x - x) + Math.abs(points[pt].y - y);
        if (minDist >= dist){
          if (minDist == dist){
            minDistPts.push(pt);
          }
          else{
            minDist = dist;
            minDistPts = [pt];
          }
        }
      }
      const minPt = minDistPts.length > 1 ? -1 : minDistPts[0];
      if (minPt > -1){
        pointCount[minPt] += 1;
      }
      
      if (minPt > -1 && (x == minX || x == maxX || y == minY || y == maxY)){
        edgePoints.add(minPt);
      }
    }
  }
  
  let largestArea = 0;
  for (let i = 0; i < pointCount.length; i++){
    if (edgePoints.has(i)) continue;
    largestArea = Math.max(largestArea, pointCount[i]);
  }

  return largestArea;
}

function distanceWithin(x, y, points, max){
  let totalDist = 0; 
  for (const pt of points){
    totalDist += Math.abs(pt.x - x) + Math.abs(pt.y - y);
    if (totalDist >= max){
      return false;
    }
  }
  return true;
}

function partTwo(points){

  const maxDist = 10000;

  let totalX = 0;
  let totalY = 0;
  for (const pt of points){
    totalX += pt.x;
    totalY += pt.y;
  }

  avgX = Math.round(totalX / points.length);
  avgY = Math.round(totalY / points.length);
  const avgPt = {x:avgX,y:avgY}; 

  const validPoints = new Set();
  const seen = new Set();
  const q = new Queue();
  q.enqueue(avgPt);
  seen.add(`[${avgX},${avgY}]`);

  while (!q.isEmpty()){
    const item = q.dequeue();
    
    if (distanceWithin(item.x, item.y, points, maxDist)){
      validPoints.add({x:item.x,y:item.y});
      for (const {dx, dy} of directions){
        const nx = item.x + dx;
        const ny = item.y + dy;
        if (!seen.has(`[${nx},${ny}]`)){
          seen.add(`[${nx},${ny}]`);
          q.enqueue({x:nx,y:ny});
        }
      }
    }
  }

  return validPoints.size;
}

function solveFile(filePath){
  var input = fs.readFileSync(filePath).toString().trim();
  const data = input.replaceAll('\n', ',');
  const points = data.split(',').reduce((acc, s, i, a) => [...acc, ...((i % 2) ? [{ x: +a[i-1], y: +s}] : []) ], []);

  console.log(`\nFile: ${filePath}`)
  
  let start = performance.now();
  const result1 = partOne(points);
  const mid = performance.now();
  console.log(`Part 1 result: ${result1} in ${(mid - start).toPrecision(6)}ms`)

  start = performance.now();
  const result2 = partTwo(points);
  const end = performance.now();

  console.log(`Part 2 result: ${result2} in ${(end - start).toPrecision(6)}ms`)
}

console.log(title)
console.log(url)
for (let filePath of process.argv.slice(2)){
  solveFile(filePath);
}
