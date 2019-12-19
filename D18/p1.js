const fs = require("fs");

function parseInput(file) {
  return file
    .trim()
    .split("\n")
    .map(line => line.split(""));
}

function each(map, fn) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      fn(map[y][x], y, x);
    }
  }
}

function findStart(map) {
  let start;
  each(map, (val, y, x) => (val === "@" ? (start = { x, y, val }) : null));
  return start;
}

function findKeys(map) {
  let keys = [];
  let a = each(map, (val, y, x) => {
    if (/[a-z]/.test(val)) {
      keys.push({ val, x, y });
    }
  });
  return keys;
}

function isWalkable(map, x, y) {
  if (x < 0 || x >= map[0].length) return false;
  if (y < 0 || y >= map.length) return false;
  return map[y][x] !== "#";
}

function calcDistance(map, from, to) {
  let queue = [{ x: from.x, y: from.y, ct: 0 }];
  const visited = [];
  for (let y = 0; y < map.length; y++) {
    visited[y] = [];
    for (let x = 0; x < map[y].length; x++) {
      visited[y][x] = false;
    }
  }

  while (queue.length > 0) {
    let next = queue.shift();
    if (map[next.y][next.x] === to.val) return next.ct;
    if (isWalkable(map, next.x + 1, next.y) && !visited[next.y][next.x + 1]) {
      queue.push({ x: next.x + 1, y: next.y, ct: next.ct + 1 });
      visited[next.y][next.x + 1] = true;
    }
    if (isWalkable(map, next.x - 1, next.y) && !visited[next.y][next.x - 1]) {
      queue.push({ x: next.x - 1, y: next.y, ct: next.ct + 1 });
      visited[next.y][next.x - 1] = true;
    }
    if (isWalkable(map, next.x, next.y + 1) && !visited[next.y + 1][next.x]) {
      queue.push({ x: next.x, y: next.y + 1, ct: next.ct + 1 });
      visited[next.y + 1][next.x] = true;
    }
    if (isWalkable(map, next.x, next.y - 1) && !visited[next.y - 1][next.x]) {
      queue.push({ x: next.x, y: next.y - 1, ct: next.ct + 1 });
      visited[next.y - 1][next.x] = true;
    }
  }
}

function calcDistances(map, keys, start) {
  const distances = { "@": {} };
  for (let i = 0; i < keys.length; i++) {
    distances[keys[i].val] = {};
    distances["@"][keys[i].val] = calcDistance(map, start, keys[i]);
    for (let j = 0; j < keys.length; j++) {
      distances[keys[i].val][keys[j].val] =
        i === j ? 0 : calcDistance(map, keys[i], keys[j]);
    }
  }

  return distances;
}

function getAvailablePoints(map, start) {
  let queue = [{ x: start.x, y: start.y, locks: [] }];

  const found = [];
  const visited = [];
  for (let y = 0; y < map.length; y++) {
    visited[y] = [];
    for (let x = 0; x < map[y].length; x++) {
      visited[y][x] = false;
    }
  }

  while (queue.length > 0) {
    let next = queue.shift();
    if (/[a-z]/.test(map[next.y][next.x]))
      found.push({
        val: map[next.y][next.x],
        x: next.x,
        y: next.y,
        locks: next.locks
      });
    if (/[A-Z]/.test(map[next.y][next.x])) {
      next.locks = [...next.locks, map[next.y][next.x].toLowerCase()];
    }

    if (isWalkable(map, next.x + 1, next.y) && !visited[next.y][next.x + 1]) {
      queue.push({
        x: next.x + 1,
        y: next.y,
        ct: next.ct + 1,
        locks: next.locks
      });
      visited[next.y][next.x + 1] = true;
    }
    if (isWalkable(map, next.x - 1, next.y) && !visited[next.y][next.x - 1]) {
      queue.push({
        x: next.x - 1,
        y: next.y,
        ct: next.ct + 1,
        locks: next.locks
      });
      visited[next.y][next.x - 1] = true;
    }
    if (isWalkable(map, next.x, next.y + 1) && !visited[next.y + 1][next.x]) {
      queue.push({
        x: next.x,
        y: next.y + 1,
        ct: next.ct + 1,
        locks: next.locks
      });
      visited[next.y + 1][next.x] = true;
    }
    if (isWalkable(map, next.x, next.y - 1) && !visited[next.y - 1][next.x]) {
      queue.push({
        x: next.x,
        y: next.y - 1,
        ct: next.ct + 1,
        locks: next.locks
      });
      visited[next.y - 1][next.x] = true;
    }
  }
  return found;
}

function getSortestDistance(start, distances, possible) {
  const cache = {};

  const token = keys => `${keys.sort()}`;
  const read = (from, keys) => {
    if (!cache[from.val]) {
      cache[from.val] = {};
      return -1;
    }
    const key = token(keys);
    const value = cache[from.val][key];

    return value ? value : -1;
  };
  const write = (from, keys, value) => {
    const key = token(keys);
    cache[from.val][key] = value;
  };

  function getKeys(key, found) {
    return possible
      .filter(p => p.val !== key.val)
      .filter(p => !found.includes(p.val))
      .filter(p =>
        p.locks.every(lock => lock === key.val || found.includes(lock))
      );
  }

  function short(from, keys, found) {
    const hit = read(from, found);
    if (hit > 0) {
      return hit;
    }
    if (keys.length === 0) return 0;

    const smallest = keys
      .map(key => {
        const distance = distances[from.val][key.val];
        return distance + short(key, getKeys(key, found), [...found, key.val]);
      })
      .reduce((min, val) => Math.min(min, val), Number.MAX_SAFE_INTEGER);
    write(from, found, smallest);
    return smallest;
  }

  return short(start, getKeys(start, []), []);
}

function read(error, file) {
  const map = parseInput(file);
  const start = findStart(map);
  const keys = findKeys(map);

  const distances = calcDistances(map, keys, start);
  const possible = getAvailablePoints(map, start);
  const shortest = getSortestDistance(start, distances, possible);

  console.log(shortest);
}

fs.readFile("./i.txt", "UTF8", read);
