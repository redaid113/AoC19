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

function read(error, file) {
  const arr = parseInput(file);

  let map = [];
  let ct = 0;
  for (let y = 0; y < 50; y++) {
    map[y] = [];
    for (let x = 0; x < 50; x++) {
      map[y][x] = getOutput(arr, x, y);
      if (map[y][x]) ct++;
    }
  }

  print(map);
  console.log(ct);
}

fs.readFile("./i.txt", "UTF8", read);
