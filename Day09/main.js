const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

const title = "## Day 9: Marble Mania ##"
const url = "https://adventofcode.com/2018/day/9"

class GameNode {
  constructor(value) {
    this.number = value;
    this.clockwise = null;
    this.anti_clockwise = null;
  }

  rotate_clockwise(n) {
    let marble = this;
    while(n-- > 0){
      marble = marble.clockwise;
    }
    return marble;
  }

  rotate_anti_clockwise(n) {
    let marble = this;
    while(n-- > 0){
      marble = marble.anti_clockwise;
    }
    return marble;
  }

  insert_clockwise(marble_number){
    let clockwise_marble = this.rotate_clockwise(1)
    const new_marble = new GameNode(marble_number);
    new_marble.anti_clockwise = this;
    new_marble.clockwise = this.clockwise;
    this.clockwise = new_marble;
    clockwise_marble.anti_clockwise = new_marble;
    return new_marble;
  }

  remove(){
    const clockwise_marble = this.clockwise;
    const anti_clockwise_marble = this.anti_clockwise;
    clockwise_marble.anti_clockwise = anti_clockwise_marble;
    anti_clockwise_marble.clockwise = clockwise_marble;
    return clockwise_marble;
  }

}

function printGame(marble){
  const start = marble.number;
  let printStr = ``;
  while (true){
    printStr += `${marble.number} `
    marble = marble.rotate_clockwise(1);
    if (marble.number == start){
      break;
    }
  }
  console.log(`Game: ${printStr}`);
}

function currentPlayer(counter, playerCount){
  const playerId = counter % playerCount;
  return playerId == 0 ? playerCount : playerId;
}

function partOne(input){
  const re = /^(\d+) players; last marble is worth (\d+) points$/i;
  const arr = input.match(re);
  const playerCount = +arr[1];
  const last_marble = +arr[2];
  const playerScores = new Array(playerCount + 1);
  playerScores.fill(0);

  let currentMarble = new GameNode(0);
  currentMarble.clockwise = currentMarble;
  currentMarble.anti_clockwise = currentMarble;

  const startingMarble = currentMarble;

  let gameCounter = 0;

  while (true){
    gameCounter++;    

    if (gameCounter % 23 == 0){
      const playerId = currentPlayer(gameCounter, playerCount);
      playerScores[playerId] += gameCounter;
      currentMarble = currentMarble.rotate_anti_clockwise(7);
      playerScores[playerId] += currentMarble.number;
      currentMarble = currentMarble.remove();
    }
    else{
      currentMarble = currentMarble.rotate_clockwise(1);
      currentMarble = currentMarble.insert_clockwise(gameCounter);
    }
    
    if (gameCounter == last_marble){
      break;

    }
  }
  
  let maxScore = 0;
  for (const score of playerScores){
    maxScore = Math.max(maxScore, score);
  }

  return maxScore;
}

function partTwo(input){
  const multiplying_factor = 100;
  const re = /^(\d+) players; last marble is worth (\d+) points$/i;
  const arr = input.match(re);
  const playerCount = +arr[1];
  const last_marble = +arr[2] * multiplying_factor; 
  const playerScores = new Array(playerCount + 1);
  playerScores.fill(0);

  let currentMarble = new GameNode(0);
  currentMarble.clockwise = currentMarble;
  currentMarble.anti_clockwise = currentMarble;

  const startingMarble = currentMarble;

  let gameCounter = 0;

  while (true){
    gameCounter++;    

    if (gameCounter % 23 == 0){
      const playerId = currentPlayer(gameCounter, playerCount);
      playerScores[playerId] += gameCounter;
      currentMarble = currentMarble.rotate_anti_clockwise(7);
      playerScores[playerId] += currentMarble.number;
      currentMarble = currentMarble.remove();
    }
    else{
      currentMarble = currentMarble.rotate_clockwise(1);
      currentMarble = currentMarble.insert_clockwise(gameCounter);
    }
    
    if (gameCounter == last_marble){
      break;

    }
  }
  
  let maxScore = 0;
  for (const score of playerScores){
    maxScore = Math.max(maxScore, score);
  }

  return maxScore;
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
