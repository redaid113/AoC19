function getFuel(value) {
  return Math.floor((value * 1.0) / 3) - 2;
}

console.log(getFuel(12)); // 2
console.log(getFuel(14)); // 2
console.log(getFuel(1969)); // 654
console.log(getFuel(100756)); // 33583

const fs = require("fs");

function parseInput(input) {
  return input
    .trim()
    .split("\n")
    .map(str => parseInt(str));
}

function read(error, input) {
  const vals = parseInput(input);
  const total = vals
    .map(val => getFuel(val))
    .reduce((sum, val) => sum + val, 0);

  console.log(total);
}

fs.readFile("./i1.txt", "UTF8", read);
