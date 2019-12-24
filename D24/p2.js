const fs = require("fs");

function parseInput(file) {
  return file.split("\n").map(line => line.split(""));
}

const WIDTH = 5;
const HEIGHT = 5;

function hasBug(arr, y, x) {
  if (!arr) return false;
  if (y < 0 || HEIGHT <= y) return false;
  if (x < 0 || WIDTH <= x) return false;
  return arr[y][x] === "#";
}

function bugNum(arr, y, x) {
  return hasBug(arr, y, x) ? 1 : 0;
}

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

function bugs(levels, key, y, x, dir) {
  if (x < 0) {
    // left down a level
    return bugNum(levels[key - 1], 2, 1);
  } else if (y < 0) {
    // up down a level
    return bugNum(levels[key - 1], 1, 2);
  } else if (y >= HEIGHT) {
    // down down a level
    return bugNum(levels[key - 1], 3, 2);
  } else if (x >= WIDTH) {
    // right down a level
    return bugNum(levels[key - 1], 2, 3);
  } else if (x === 2 && y === 2) {
    // middle up a level
    const b = (yy, xx) => bugNum(levels[key + 1], yy, xx);
    switch (dir) {
      case UP:
        return b(4, 0) + b(4, 1) + b(4, 2) + b(4, 3) + b(4, 4);
      case DOWN:
        return b(0, 0) + b(0, 1) + b(0, 2) + b(0, 3) + b(0, 4);
      case LEFT:
        return b(0, 4) + b(1, 4) + b(2, 4) + b(3, 4) + b(4, 4);
      case RIGHT:
        return b(0, 0) + b(1, 0) + b(2, 0) + b(3, 0) + b(4, 0);
    }
  }
  return bugNum(levels[key], y, x);
}

function bugsAdjacent(levels, key, y, x) {
  return (
    bugs(levels, key, y + 1, x, DOWN) +
    bugs(levels, key, y - 1, x, UP) +
    bugs(levels, key, y, x + 1, RIGHT) +
    bugs(levels, key, y, x - 1, LEFT)
  );
}

function infestingTime(levels, key, y, x) {
  const ct = bugsAdjacent(levels, key, y, x);
  return ct === 1 || ct === 2;
}

function bugDies(levels, key, y, x) {
  const ct = bugsAdjacent(levels, key, y, x);
  return ct !== 1;
}

function getNext(levels, key) {
  const newArr = [];
  for (let y = 0; y < HEIGHT; y++) {
    newArr[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      if (y === 2 && x === 2) {
        newArr[y][x] = ".";
        continue;
      }
      if (levels[key][y][x] === "#") {
        newArr[y][x] = bugDies(levels, key, y, x) ? "." : "#";
      } else {
        newArr[y][x] = infestingTime(levels, key, y, x) ? "#" : ".";
      }
    }
  }

  return newArr;
}

function emptyLevel() {
  const arr = [];
  for (let y = 0; y < 5; y++) {
    arr[y] = [];
    for (let x = 0; x < 4; x++) {
      arr[y][x] = ".";
    }
  }

  return arr;
}

function getNextLevels(levels) {
  let nextLevels = {};

  const keys = Object.keys(levels).map(key => parseInt(key));
  let min = keys.reduce((m, v) => Math.min(m, v), 0);
  let max = keys.reduce((m, v) => Math.max(m, v), 0);
  levels[min - 1] = emptyLevel();
  levels[max + 1] = emptyLevel();

  [...keys, min - 1, max + 1].forEach(key => {
    nextLevels[key] = getNext(levels, key);
  });

  if (!nextLevels[min - 1].some(line => line.some(c => c === "#"))) {
    delete nextLevels[min - 1];
  }
  if (!nextLevels[max + 1].some(line => line.some(c => c === "#"))) {
    delete nextLevels[max + 1];
  }
  return nextLevels;
}

function print(arr) {
  for (let y = 0; y < arr.length; y++) {
    console.log(arr[y].join(""));
  }
  console.log("\n");
}

function printLevels(levels) {
  Object.keys(levels)
    .map(key => parseInt(key))
    .sort((a, b) => a - b)
    .forEach(key => {
      console.log(`Level ${key}`);
      print(levels[key]);
    });
}

function countBugs(levels) {
  return Object.values(levels).reduce((ct, arr) => {
    for (let y = 0; y < arr.length; y++) {
      for (let x = 0; x < arr[y].length; x++) {
        ct += hasBug(arr, y, x) ? 1 : 0;
      }
    }
    return ct;
  }, 0);
}

function part2(arr) {
  let levels = {};
  levels[0] = arr;

  for (let i = 0; i < 200; i++) {
    levels = getNextLevels(levels);
  }
  // printLevels(levels);
  const bugCt = countBugs(levels);
  console.log("Part 2:", bugCt);
}

function read(error, file) {
  let arr = parseInput(file);

  part2(arr);
}

fs.readFile("./i.txt", "UTF8", read);
