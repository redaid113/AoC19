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

function count(node, path1, path2) {
  return (
    path1.length -
    path1.indexOf(node) -
    1 +
    (path2.length - path2.indexOf(node) - 1) -
    2
  );
}

function getPath(map, from, to) {
  if (from === to) return [to];
  for (let i = 0; i < map[from].orbitsMe.length; i++) {
    const arr = getPath(map, map[from].orbitsMe[i], to);
    if (arr.length !== 0) {
      return [from, ...arr];
    }
  }
  return [];
}

function getSimilarNodes(path1, path2) {
  return path1.filter(node => path2.includes(node));
}

function read(error, input) {
  const vals = parseInput(input);
  const map = buildMap(vals);
  fillInMap(vals, map);
  const youPath = getPath(map, "COM", "YOU");
  const sanPath = getPath(map, "COM", "SAN");

  const nodes = getSimilarNodes(youPath, sanPath);
  const total = nodes.reduce(
    (min, node) => Math.min(min, count(node, youPath, sanPath)),
    Number.MAX_SAFE_INTEGER
  );

  console.log(total);
}

fs.readFile("./i.txt", "UTF8", read);
