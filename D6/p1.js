const fs = require("fs");

function parseInput(input) {
  return input
    .trim()
    .split("\n")
    .map(str => str.split(")"));
}

function buildMap(vals) {
  return vals.reduce((map, [to, from]) => {
    map[to] = { orbitsMe: [] };
    map[from] = { orbitsMe: [] };
    return map;
  }, {});
}

function fillInMap(vals, map) {
  vals.forEach(([to, from]) => {
    map[to].orbitsMe.push(from);
  });
}

function count(map, val, indirects = 0) {
  return map[val].orbitsMe.reduce(
    (sum, guy) => sum + 1 + +indirects + count(map, guy, indirects + 1),
    0
  );
}

function read(error, input) {
  const vals = parseInput(input);
  const map = buildMap(vals);
  fillInMap(vals, map);
  const total = count(map, "COM");

  console.log(total);
}

fs.readFile("./i.txt", "UTF8", read);
