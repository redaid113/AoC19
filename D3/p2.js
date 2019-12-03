const fs = require("fs");

function parseInput(input) {
  return input
    .trim()
    .split("\n")
    .map(line =>
      line
        .split(",")
        .map(instruction => [
          instruction.charAt(0),
          parseInt(instruction.substring(1))
        ])
    );
}

function getPoints(line) {
  let cur = [0, 0];
  let points = [];
  let steps = 0;
  line.forEach(([i, l]) => {
    const x = i === "R" ? 1 : i === "L" ? -1 : 0;
    const y = i === "U" ? 1 : i === "D" ? -1 : 0;
    for (let i = 0; i < l; i++) {
      steps += 1;
      cur = [cur[0] + x, cur[1] + y];
      points.push([...cur, steps]);
    }
  });
  return points;
}

function getIntersections(points1, points2) {
  const intersections = [];

  points1.forEach(([x, y, s]) => {
    const p2 = points2.find(p => p[0] === x && p[1] === y);
    if (p2) {
      intersections.push(s + p2[2]);
    }
  });
  return intersections;
}

function getClosest(intersections) {
  return intersections.reduce(
    (min, s) => Math.min(min, s),
    Number.MAX_SAFE_INTEGER
  );
}

function read(error, input) {
  const lines = parseInput(input);
  const points1 = getPoints(lines[0]);
  const points2 = getPoints(lines[1]);
  const intersections = getIntersections(points1, points2);

  const closest = getClosest(intersections);
  console.log(closest);
}

fs.readFile("./i2.txt", "UTF8", read);
