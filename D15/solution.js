const fs = require("fs");
const IntCode = require("../IntCode");

function parseInput(file) {
  return file
    .trim()
    .split(",")
    .map(num => parseInt(num));
}

const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;

const WALL = 0;
const MOVED = 1;
const MOVED_OXY = 2;

function buildMap(arr) {
  const code = new IntCode(arr);
  const iter = code.iter();
  iter.next();
  let queue = [[code, iter, [], 0, { x: 0, y: 0 }]];

  let points = [{ x: 0, y: 0 }];
  let walls = [];
  let oxygen;

  while (queue.length > 0) {
    const next = queue.shift();
    const d = next[0].output.shift();
    if (d === MOVED_OXY) {
      oxygen = next[4];
      console.log("Part1: ", next[3]);
      //   return next[3];
    } else if (d === WALL) {
      walls.push(next[4]);
      continue;
    }
    next[0].output = [];

    if (!points.find(ss => ss.x === next[4].x && ss.y === next[4].y + 1)) {
      const c1 = new IntCode(arr);
      const s1 = c1.iter();
      s1.next();
      next[2].forEach(dir => s1.next(dir));
      c1.output = [];
      s1.next(NORTH);
      queue.push([
        c1,
        s1,
        [...next[2], NORTH],
        next[3] + 1,
        {
          x: next[4].x,
          y: next[4].y + 1
        }
      ]);
      points.push({
        x: next[4].x,
        y: next[4].y + 1
      });
    }

    if (!points.find(ss => ss.x === next[4].x && ss.y === next[4].y - 1)) {
      const c2 = new IntCode(arr);
      const s2 = c2.iter();
      s2.next();
      next[2].forEach(dir => s2.next(dir));
      c2.output = [];
      s2.next(SOUTH);
      queue.push([
        c2,
        s2,
        [...next[2], SOUTH],
        next[3] + 1,
        {
          x: next[4].x,
          y: next[4].y - 1
        }
      ]);
      points.push({
        x: next[4].x,
        y: next[4].y - 1
      });
    }

    if (!points.find(ss => ss.x === next[4].x + 1 && ss.y === next[4].y)) {
      const c3 = new IntCode(arr);
      const s3 = c3.iter();
      s3.next();
      next[2].forEach(dir => s3.next(dir));
      c3.output = [];
      s3.next(EAST);
      queue.push([
        c3,
        s3,
        [...next[2], EAST],
        next[3] + 1,
        {
          x: next[4].x + 1,
          y: next[4].y
        }
      ]);
      points.push({
        x: next[4].x + 1,
        y: next[4].y
      });
    }

    if (!points.find(ss => ss.x === next[4].x - 1 && ss.y === next[4].y)) {
      const c4 = new IntCode(arr);
      const s4 = c4.iter();
      s4.next();
      next[2].forEach(dir => s4.next(dir));
      c4.output = [];
      s4.next(WEST);
      queue.push([
        c4,
        s4,
        [...next[2], WEST],
        next[3] + 1,
        {
          x: next[4].x - 1,
          y: next[4].y
        }
      ]);
      points.push({
        x: next[4].x - 1,
        y: next[4].y
      });
    }
  }

  let realPoints = points.filter(
    point => !walls.find(({ x, y }) => point.x === x && point.y === y)
  );
  const minX = realPoints.map(p => p.x).reduce((min, x) => Math.min(x, min), 0);
  const maxX = realPoints.map(p => p.x).reduce((min, x) => Math.max(x, min), 0);
  const minY = realPoints.map(p => p.y).reduce((min, x) => Math.min(x, min), 0);
  const maxY = realPoints.map(p => p.y).reduce((min, x) => Math.max(x, min), 0);

  let map = [];
  for (let y = 0; y <= maxY - minY; y++) {
    map[y] = [];
    for (let x = 0; x <= maxX - minX; x++) {
      map[y][x] = false;
    }
  }

  realPoints = realPoints.map(({ x, y }) => ({ x: x - minX, y: y - minY }));
  oxygen = { x: oxygen.x - minX, y: oxygen.y - minY };

  map[oxygen.y][oxygen.x] = true;
  queue = [oxygen];

  let ct = 0;
  while (true) {
    let nextQueue = [];
    while (queue.length > 0) {
      const cur = queue.shift();
      function addNext(x, y) {
        if (realPoints.find(p => p.x === x && p.y === y) && !map[y][x]) {
          map[y][x] = true;
          nextQueue.push({ x, y });
        }
      }

      addNext(cur.x, cur.y + 1);
      addNext(cur.x, cur.y - 1);
      addNext(cur.x + 1, cur.y);
      addNext(cur.x - 1, cur.y);
    }
    if (nextQueue.length === 0) return ct;
    queue = nextQueue;
    ct++;
  }
}

function read(error, file) {
  const arr = parseInput(file);
  const ct = buildMap(arr);
  console.log("Part2: ", ct);
}

fs.readFile("./i.txt", "UTF8", read);
