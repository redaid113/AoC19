const fs = require("fs");

function parseInput(file) {
  return file.split("\n").map(line => line.split(""));
}

function hasBug(arr, y, x) {
  if (y < 0 || arr.length <= y) return false;
  if (x < 0 || arr[y].length <= x) return false;
  return arr[y][x] === "#";
}

function bugsAdjacent(arr, y, x) {
  let ct = 0;
  ct += hasBug(arr, y + 1, x) ? 1 : 0;
  ct += hasBug(arr, y - 1, x) ? 1 : 0;
  ct += hasBug(arr, y, x + 1) ? 1 : 0;
  ct += hasBug(arr, y, x - 1) ? 1 : 0;
  return ct;
}

function infestingTime(arr, y, x) {
  const ct = bugsAdjacent(arr, y, x);
  return ct === 1 || ct === 2;
}

function bugDies(arr, y, x) {
  const ct = bugsAdjacent(arr, y, x);
  return ct !== 1;
}

function getNext(arr) {
  const newArr = [];
  for (let y = 0; y < arr.length; y++) {
    newArr[y] = [];
    for (let x = 0; x < arr[y].length; x++) {
      if (arr[y][x] === ".") {
        newArr[y][x] = infestingTime(arr, y, x) ? "#" : ".";
      } else {
        newArr[y][x] = bugDies(arr, y, x) ? "." : "#";
      }
    }
  }

  return newArr;
}

function print(arr) {
  for (let y = 0; y < arr.length; y++) {
    console.log(arr[y].join(""));
  }
  console.log("\n");
}

function hash(arr) {
  return arr.reduce((line, row) => `${line}${row.join("")}`, "");
}

function findRepeated(arr) {
  const found = {};
  while (!found[hash(arr)]) {
    found[hash(arr)] = true;
    arr = getNext(arr);
  }
  return arr;
}

function biodiversity(arr) {
  let rating = 0;
  for (let y = 0; y < arr.length; y++) {
    for (let x = 0; x < arr[y].length; x++) {
      if (hasBug(arr, y, x)) {
        rating += Math.pow(2, arr[y].length * y + x);
      }
    }
  }
  return rating;
}

function part1(arr) {
  const repeated = findRepeated(arr);
  const rating = biodiversity(repeated);
  console.log("Part 1: ", rating);
}

function read(error, file) {
  let arr = parseInput(file);

  part1(arr);
}

fs.readFile("./i.txt", "UTF8", read);
