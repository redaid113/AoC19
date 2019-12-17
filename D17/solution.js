const fs = require("fs");
const IntCode = require("../IntCode");

function parseInput(file) {
  return file
    .trim()
    .split(",")
    .map(num => parseInt(num));
}

function buildMap(camera) {
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
  return (
    y < map.length &&
    y >= 0 &&
    x < map[y].length &&
    x >= 0 &&
    ["#", "<", ">", "^", "v"].includes(map[y][x])
  );
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

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

function findRobot(map) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (["<", ">", "^", "v"].includes(map[i][j])) {
        return {
          x: j,
          y: i,
          dir:
            map[i][j] === "^"
              ? UP
              : map[i][j] === "v"
              ? DOWN
              : map[i][j] === ">"
              ? RIGHT
              : LEFT
        };
      }
    }
  }
}

function done({ x, y, dir }, map) {
  switch (dir) {
    case UP:
    case DOWN:
      return !isScaffold(map, x + 1, y) && !isScaffold(map, x - 1, y);
    case LEFT:
    case RIGHT:
      return !isScaffold(map, x, y + 1) && !isScaffold(map, x, y - 1);
  }
}

function getTurnDirection({ dir, x, y }, map) {
  switch (dir) {
    case UP:
      if (isScaffold(map, x + 1, y)) return "R";
      return "L";
    case DOWN:
      if (isScaffold(map, x + 1, y)) return "L";
      return "R";
    case LEFT:
      if (isScaffold(map, x, y + 1)) return "L";
      return "R";
    case RIGHT:
      if (isScaffold(map, x, y + 1)) return "R";
      return "L";
  }
}

function turn(robot, map) {
  const LR = getTurnDirection(robot, map);
  robot.dir = LR === "R" ? (robot.dir + 1) % 4 : (robot.dir + 3) % 4;
  return LR;
}

function getWalkChange(dir) {
  switch (dir) {
    case UP:
      return { x: 0, y: -1 };
    case DOWN:
      return { x: 0, y: 1 };
    case RIGHT:
      return { x: 1, y: 0 };
    case LEFT:
      return { x: -1, y: 0 };
  }
}

function walk(robot, map) {
  const change = getWalkChange(robot.dir);
  let distance = 0;
  while (isScaffold(map, robot.x + change.x, robot.y + change.y)) {
    distance++;
    robot.x += change.x;
    robot.y += change.y;
  }
  return distance;
}

function getCommands(map) {
  const robot = findRobot(map);
  const commands = [];
  while (!done(robot, map)) {
    const LR = turn(robot, map);
    commands.push(LR);
    const distance = walk(robot, map);
    commands.push(distance);
  }
  return commands;
}

function read(error, file) {
  const arr = parseInput(file);

  arr[0] = 2;
  const camera = new IntCode(arr);
  const iter = camera.iter();
  iter.next();

  const map = buildMap(camera);
  print(map);

  console.log("Part1: ", getAlignmentParemetersSum(map));

  const commands = getCommands(map);
  console.log(commands.join(","));

  const PATTERN = "A,C,A,C,B,B,C,A,C,B\n";

  const A = "L,12,L,10,R,8,L,12";
  const B = "L,10,R,12,R,8";
  const C = "R,8,R,10,R,12";
  const MOVEMENT = `${A}\n${B}\n${C}\n`;

  const input = str => {
    for (let i = 0; i < str.length; i++) {
      iter.next(str.charCodeAt(i));
    }
  };

  input(PATTERN);
  input(MOVEMENT);
  camera.output = [];

  input("n\n");
  console.log(camera.output.pop(), camera.output.length);
}
//A,C,A,C,B,B,C,A,C,B
//L,12,L,10,R,8,L,12,R,8,R,10,R,12,L,12,L,10,R,8,L,12,R,8,R,10,R,12,L,10,R,12,R,8,L,10,R,12,R,8,R,8,R,10,R,12,L,12,L,10,R,8,L,12,R,8,R,10,R,12,L,10,R,12,R,8

// A - L,12,L,10,R,8,L,12
// B - L,10,R,12,R,8
// C - R,8,R,10,R,12
fs.readFile("./i.txt", "UTF8", read);
