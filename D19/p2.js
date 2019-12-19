const fs = require("fs");
const IntCode = require("../IntCode");

function parseInput(file) {
  return file
    .trim()
    .split(",")
    .map(num => parseInt(num));
}

function print(map) {
  for (let i = 0; i < map.length; i++) {
    let line = "";
    for (let j = 0; j < map[i].length; j++) {
      line += map[i][j];
    }
    console.log(line);
  }
}

function getOutput(arr, x, y) {
  const camera = new IntCode([...arr]);
  const iter = camera.iter();
  iter.next();
  iter.next(x);
  iter.next(y);
  const ret = camera.output.shift();
  return ret ? 1 : 0;
}

function fullDiagonal(arr, length, { x, y }) {
  for (let i = 0; i < length; i++) {
    if (!getOutput(arr, x - i, y + i)) return false;
  }
  return true;
}

function findSquare(arr, length) {
  let right = { x: 0, y: 0 };
  while (!fullDiagonal(arr, length, right)) {
    right.x += 1;

    const r = getOutput(arr, right.x, right.y);
    if (!r) {
      right.x -= 1;
      right.y += 1;
    }

    while (!getOutput(arr, right.x, right.y)) {
      right.x += 1;
    }
    // return right;
  }
  return { x: right.x - length + 1, y: right.y };
}

/*
 Find top right to bottom left === 100
*/

function read(error, file) {
  const arr = parseInput(file);

  const { x, y } = findSquare(arr, 100);
  console.log(x, y);
  console.log(x * 10000 + y);
}

fs.readFile("./i.txt", "UTF8", read);
