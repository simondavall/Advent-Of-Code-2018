const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

const title = "## Day 4: Repose Record ##"
const url = "https://adventofcode.com/2018/day/4"

const guardData = new Object();
const guardTotals = new Object();


function getGuardData(schedule){
  const guardRegEx = /^Guard\s#(\d+)\sbegins\sshift$/i;

  let guardId = -1;
  let isAsleep = false;
  let asleepAt = -1;

  const guardSeen = new Set([-1]);

  const keys = Object.keys(schedule);
  keys.sort((a, b) => a - b);

  for(const key of keys){
    const item = schedule[key];
    const code = item.data[0];

    switch(code){
      case 'G':
        if (isAsleep && guardId > -1 && asleepAt > -1){
          // finish prev guard sleep
          for (let i = asleepAt; i <= 59; i++){
            guardData[guardId][i] = (guardData[guardId][i] | 0) + 1;
            guardTotals[guardId] += 1;
          }
          isAsleep = false;
          asleepAt = -1;
        }

        guardId = Number(item.data.match(guardRegEx)[1]);
        if (!guardSeen.has(guardId)){
          guardData[guardId] = [];
          guardTotals[guardId] = 0;
          guardSeen.add(guardId);
        }
        break;

      case 'f':
        assert(isAsleep == false && asleepAt == -1 && guardId > -1, `Cannot fall asleep. State incorrect. isAsleep:${isAsleep}, asleepAt:${asleepAt}, guardId:${guardId}`);
        isAsleep = true;
        asleepAt = item.date.getMinutes();
        break;

      case 'w':
        assert(isAsleep == true && asleepAt > -1 && guardId > -1, `Cannot wake up. State incorrect. isAsleep:${isAsleep}, asleepAt:${asleepAt}, guardId:${guardId}`);
        const wokeUpAt = item.date.getMinutes();
        for (let i = asleepAt; i < wokeUpAt; i++){
          guardData[guardId][i] = (guardData[guardId][i] | 0) + 1;
          guardTotals[guardId] += 1;
        }
        isAsleep = false;
        asleepAt = -1;
        break;

      default:
        assert.fail(`Unknown data code. [${item.data}]`);
    }
  }
}

function partOne(input){

  const schedule = new Object();

  for (const line of input){
    const data = line.slice(1).split(']');
    assert(data.length == 2, "Unexpected input data");
    const dt = new Date(data[0]);

    schedule[dt.getTime()] = { date: dt, data: data[1].trim()};
  }

  getGuardData(schedule);

  const ids = Object.keys(guardTotals);
  let maxGuardId = -1;
  let maxSleep = 0;
  for (let id of ids){
    if (guardTotals[id] > maxSleep){
      maxSleep = guardTotals[id];
      maxGuardId = id;
    }
  }

  let maxMins = -1;
  let maxFreq = -1;
  for (let i = 0; i < guardData[maxGuardId].length; i++){
    if (guardData[maxGuardId][i] > maxFreq){
      maxFreq = guardData[maxGuardId][i];
      maxMins = i;
    }
  }
  
  return maxGuardId * maxMins;
}

function partTwo(input){
  
  const guardIds = Object.keys(guardTotals);
  
  let maxMins = -1;
  let maxFreq = -1;
  let maxGuardId = -1;

  for (const id of guardIds){
    for (let i = 0; i < guardData[id].length; i++){
      if (guardData[id][i] > maxFreq){
        maxGuardId = id;
        maxFreq = guardData[maxGuardId][i];
        maxMins = i;
      }
    }
  }

  return maxGuardId * maxMins;
}

function solveFile(filePath){
  var input = fs.readFileSync(filePath).toString().trim().split('\n');
  console.log(`\nFile: ${filePath}`)
  
  let start = performance.now();
  const result1 = partOne(input);
  const mid = performance.now();
  console.log(`Part 1 result: ${result1} in ${(mid - start).toPrecision(6)}ms`)


  start = performance.now();
  const result2 = partTwo(input);
  const end = performance.now();
  const arr = Array.from(result2).sort();

  console.log(`Part 2 result: ${result2} in ${(end - start).toPrecision(6)}ms`)
}

console.log(title)
console.log(url)
for (let filePath of process.argv.slice(2)){
  solveFile(filePath);
}
