const fs = require("fs");
const IntCode = require("../IntCode");

function parseInput(file) {
  return file
    .trim()
    .split(",")
    .map(num => parseInt(num));
}

function buildMap(camera) {
  const iter = camera.iter();
  iter.next();

  const map = [];
  let line = 0;
  let x = 0;
  map[0] = [];
  while (camera.output.length > 0) {
    const value = camera.output.shift();
    if (value === 10) {
      map[++line] = [];
      x = 0;
      continue;
    }
    map[line][x++] = String.fromCharCode(value);
  }
  while (map[map.length - 1].length === 0) {
    map.pop();
  }
  return map;
}

function isScaffold(map, x, y) {
  return ["#", "<", ">", "^", "v"].includes(map[y][x]);
}

function isIntersection(map, x, y) {
  return (
    isScaffold(map, x, y) &&
    isScaffold(map, x + 1, y) &&
    isScaffold(map, x - 1, y) &&
    isScaffold(map, x, y + 1) &&
    isScaffold(map, x, y - 1)
  );
}

function getAlignmentParemetersSum(map) {
  let sum = 0;
  for (let i = 1; i < map.length - 1; i++) {
    for (let j = 1; j < map[i].length - 1; j++) {
      if (isIntersection(map, j, i)) {
        sum += i * j;
      }
    }
  }
  return sum;
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

function read(error, file) {
  const arr = parseInput(file);

  const camera = new IntCode(arr);

  const map = buildMap(camera);
  print(map);
  console.log(getAlignmentParemetersSum(map));
}

fs.readFile("./i.txt", "UTF8", read);
