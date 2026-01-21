const fs = require("fs");
const os = require("os");
const assert = require("assert");
const { performance } = require("perf_hooks");

const title = "## Day 24: Immune System Simulator 20XX ##"
const url = "https://adventofcode.com/2018/day/24"

let nextId = 0;

class Army {
  constructor(id, units, hp, dam, damtype, init, type, weak, immune) {
    this.id = id;
    this.units = units;
    this.hit_points = hp;
    this.damage = dam;
    this.damage_type = damtype;
    this.initiative = init;
    this.type = type;
    this.weakness = new Set(weak);
    this.immunity = new Set(immune);
  }

  getPower() {
    return this.units * this.damage;
  }

  toString() {
    return (
      `id:${this.id}, units:${this.units}, hit_points:${this.hit_points}, damage:${this.damage}, ` +
      `damage_type:${this.damage_type}, initiative:${this.initiative}, type:${this.type} ` +
      `weakness:${Array.from(this.weakness)}, immunity:${Array.from(this.immunity)}, effectivePower:${this.getPower()}`
    );
  }
}

function partOne(immuneData, infectionData) {
  let armies = [];
  armies.push(...getArmies(immuneData, "immune", 0));
  armies.push(...getArmies(infectionData, "infection", 0));

  while (true) {
    const attackPairings = getAttackPairings(armies);

    attackPairings.sort((a, b) => b.initiative - a.initiative);

    for (const { attacker, defender } of attackPairings) {
      if (attacker.units <= 0) {
        continue;
      }
      const damage = getDamage(attacker, defender);
      const killedUnits = Math.trunc(damage / defender.hit_points);
      defender.units -= killedUnits;
    }

    armies = armies.filter((x) => x.units > 0);

    if (
      armies.filter((x) => x.type == "immune").length == 0 ||
      armies.filter((x) => x.type == "infection").length == 0
    ) {
      break;
    }
  }

  return armies.reduce((acc, cur) => acc + cur.units, 0);
}

function partTwo(immuneData, infectionData) {
  let boost = 1;
  let armies = [];

  while (true) {
    armies = [];
    const immunities = getArmies(immuneData, "immune", boost);
    const infections = getArmies(infectionData, "infection", 0);
    armies.push(...immunities.slice());
    armies.push(...infections.slice());

    const visited = new Set();

    while (true) {
      const attackPairings = getAttackPairings(armies);

      attackPairings.sort((a, b) => b.initiative - a.initiative);

      for (const { attacker, defender } of attackPairings) {
        if (attacker.units <= 0) { continue; }

        const damage = getDamage(attacker, defender);
        const killedUnits = Math.trunc(damage / defender.hit_points);
        defender.units -= killedUnits;
      }

      armies = armies.filter((x) => x.units > 0); // remove armies with 0 units

      const health = armies.reduce((acc, cur) => acc + cur.units, 0);
      if (visited.has(health) ||
        armies.filter((x) => x.type == "immune").length == 0 ||
        armies.filter((x) => x.type == "infection").length == 0) 
      {
        break; // found an end or deadlock
      }
      visited.add(health);
    }
    if (armies.filter((x) => x.type == "infection").length == 0) {
      break; // immune wins
    }
    
    boost += 1; // increase boost and re-run the attack
  }

  //console.log(`Final boost: ${boost}\\`);
  return armies.reduce((acc, cur) => acc + cur.units, 0);
}

function getAttackPairings(armies) {
  const attackPairings = [];
  const selected = new Set();

  armies.sort((a, b) => b.initiative - a.initiative);
  armies.sort((a, b) => b.getPower() - a.getPower());
  for (const attacker of armies) {
    let selectedDefender = null;
    let maxDamage = 1;
    let maxPower = 0;
    let maxInitiative = 0;
    for (const defender of armies.filter(x => x.type != attacker.type && !selected.has(x.id))) {
      const damage = getDamage(attacker, defender);

      if (damage > maxDamage ||
        (damage == maxDamage && defender.getPower() > maxPower) ||
        (damage == maxDamage && defender.getPower() == maxPower && defender.initiative > maxInitiative))
      {
        selectedDefender = defender;
        maxDamage = damage;
        maxInitiative = defender.initiative;
        maxPower = defender.getPower();
      }
    }

    if (selectedDefender != null) {
      attackPairings.push({
        attacker: attacker,
        defender: selectedDefender,
        initiative: attacker.initiative,
      });
      selected.add(selectedDefender.id);
    }
  }
  return attackPairings;
}

function getDamage(attacker, defender) {
  const type = attacker.damage_type;
  if (defender.immunity.has(type)) {
    return 0;
  }

  const power = attacker.getPower();
  if (defender.weakness.has(type)) {
    return power * 2;
  }

  return power;
}

function getArmies(data, type, boost) {
  const armies = [];
  const regEx =
    /(\d+)\sunits\seach\swith\s(\d+)\shit\spoints\s(?:\((.*)\)\s)?with\san\sattack\sthat\sdoes\s(\d+)\s(\w+)\sdamage\sat\sinitiative\s(\d+)/i;
  for (const line of data) {
    const m = line.match(regEx);
    const { weakness, immunity } = getAttributes(m[3]);
    const army = new Army(nextId++, +m[1], +m[2], +m[4] + boost, m[5], +m[6], type, weakness, immunity);
    armies.push(army);
  }
  return armies;
}

function getAttributes(str) {
  let immunities = [];
  let weaknesses = [];
  if (str !== undefined && str.length > 0) {
    const arr = str.split("; ");
    for (const line of arr) {
      if (line.startsWith("immune to ")) {
        immuneStr = line.slice(10);
        immunities = immuneStr.split(", ");
      } else if (line.startsWith("weak to ")) {
        weakStr = line.slice(8);
        weaknesses = weakStr.split(", ");
      }
    }
  }

  return { weakness: weaknesses, immunity: immunities };
}

function solveFile(filePath) {
  nextId = 0;
  var input = fs.readFileSync(filePath).toString().trim().split("\n\n");
  console.log(`\nFile: ${filePath}`);
  assert(input.length == 2, `Expected 2 inputs, got ${input.length}`);

  const immuneData = input[0].split("\n").slice(1);
  const infectionData = input[1].split("\n").slice(1);

  let start = performance.now();
  const result1 = partOne(immuneData, infectionData);
  const mid = performance.now();
  console.log(`Part 1 result: ${result1} in ${(mid - start).toPrecision(6)}ms`);

  start = performance.now();
  const result2 = partTwo(immuneData, infectionData);
  const end = performance.now();
  console.log(`Part 2 result: ${result2} in ${(end - start).toPrecision(6)}ms`);
}

console.log(title)
console.log(url)
for (let filePath of process.argv.slice(2)) {
  solveFile(filePath);
}
