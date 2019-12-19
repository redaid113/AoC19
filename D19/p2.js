const fs = require("fs");
const IntCode = require("../IntCode");

function parseInput(file) {
  return file
    .trim()
    .split(",")
    .map(num => parseInt(num));
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
  const diff = length - 1;
  return getOutput(arr, x - diff, y + diff);
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
  }
  return { x: right.x - length + 1, y: right.y };
}

function read(error, file) {
  const arr = parseInput(file);

  const { x, y } = findSquare(arr, 100);
  console.log(x, y);
  console.log(x * 10000 + y);
}

fs.readFile("./i.txt", "UTF8", read);
