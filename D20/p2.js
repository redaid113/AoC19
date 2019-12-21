const fs = require("fs");

function parseInput(file) {
  return file
    .split("\n")
    .map(line => line.split(""))
    .filter(a => a.length > 0);
}

const get = (arr, x, y) => {
  if (y < 0 || y >= arr.length) return "#";
  if (x < 0 || x >= arr[y].length) return "#";
  return arr[y][x];
};

const isPortal = (arr, x, y) => /[A-Z]/.test(get(arr, x, y));
const isWall = (arr, x, y) => get(arr, x, y) === "#";
const isPath = (arr, x, y) => get(arr, x, y) === ".";

function getVerticalPortals(arr) {
  let portals = [];

  for (let y = 0; y < arr.length; y++) {
    for (let x = 0; x < arr[y].length; x++) {
      if (isPortal(arr, x, y) && isPortal(arr, x, y + 1)) {
        portals.push({
          key: `${get(arr, x, y)}${get(arr, x, y + 1)}`,
          location: {
            x,
            y: isPath(arr, x, y + 2) ? y + 2 : y - 1
          }
        });
      }
    }
  }
  return portals;
}

function getHorizonalPortals(arr) {
  let portals = [];

  for (let y = 0; y < arr.length; y++) {
    for (let x = 0; x < arr[y].length; x++) {
      if (isPortal(arr, x, y) && isPortal(arr, x + 1, y)) {
        portals.push({
          key: `${get(arr, x, y)}${get(arr, x + 1, y)}`,
          location: {
            x: isPath(arr, x + 2, y) ? x + 2 : x - 1,
            y
          }
        });
      }
    }
  }

  return portals;
}

function getPortals(arr) {
  return [...getVerticalPortals(arr), ...getHorizonalPortals(arr)];
}

function calcDistance(arr, start, end) {
  const visited = [];
  for (let y = 0; y < arr.length; y++) {
    visited[y] = [];
    for (let x = 0; x < arr.length; x++) {
      visited[y][x] = false;
    }
  }
  const visit = (x, y) => (visited[y][x] = true);
  const been = (x, y) => visited[y][x];
  const queue = [{ ...start.location, ct: 0 }];
  while (queue.length > 0) {
    const cur = queue.shift();
    if (cur.x === end.location.x && cur.y === end.location.y) return cur.ct;

    const go = (x, y) => {
      if (!been(x, y) && isPath(arr, x, y)) {
        visit(x, y);
        queue.push({ x, y, ct: cur.ct + 1 });
      }
    };

    go(cur.x, cur.y + 1);
    go(cur.x, cur.y - 1);
    go(cur.x + 1, cur.y);
    go(cur.x - 1, cur.y);
  }
  return -1;
}

function samePortal(p1, p2) {
  return (
    p1.key === p2.key &&
    p1.location.x === p2.location.x &&
    p1.location.y === p2.location.y
  );
}

function matchingPortal(p1, p2) {
  return (
    p1.key === p2.key &&
    (p1.location.x !== p2.location.x || p1.location.y !== p2.location.y)
  );
}

function hash(x, y) {
  return `x${x}y${y}`;
}

function unhash(str) {
  const [x, y] = str
    .replace("x", "")
    .split("y")
    .map(s => parseInt(s));
  return { x, y };
}

function calcDistances(arr, portals) {
  const distances = {};

  portals.forEach(from => {
    const fromKey = hash(from.location.x, from.location.y);
    distances[fromKey] = {};
    portals.forEach(to => {
      if (samePortal(from, to)) return;

      const toKey = hash(to.location.x, to.location.y);

      if (matchingPortal(from, to)) {
        distances[fromKey][toKey] = 1;
      } else {
        const distance = calcDistance(arr, from, to);
        if (distance > 0) {
          distances[fromKey][toKey] = distance;
        }
      }
    });
  });

  return distances;
}

function isOuterRing(arr, str) {
  const { x, y } = unhash(str);
  return y === 2 || y === arr.length - 3 || x === 2 || x === arr[y].length - 3;
}

function shortest(arr, portals, distances) {
  const start = portals.find(portal => portal.key === "AA");
  const end = portals.find(portal => portal.key === "ZZ");
  const endHash = hash(end.location.x, end.location.y);

  const initDistances = distances[hash(start.location.x, start.location.y)];

  const potential = Object.keys(initDistances)
    .filter(point => !isOuterRing(arr, point) || point === endHash)
    .map(point => ({
      point,
      distance: initDistances[point],
      level: 0,
      path: [
        [hash(start.location.x, start.location.y), 0],
        [point, 0]
      ]
    }));

  const seen = {};
  portals.forEach(p => (seen[hash(p.location.x, p.location.y)] = []));
  seen[hash(start.location.x, start.location.y)] = [true];
  const next = () => {
    let index;
    let small = Number.MAX_SAFE_INTEGER;
    potential.forEach((p, i) => {
      if (p.distance < small) {
        index = i;
        small = p.distance;
      }
    });
    return potential.splice(index, 1)[0];
  };
  while (potential.length > 0) {
    const cur = next();
    if (cur.level < 0 || seen[cur.point][cur.level]) continue;
    seen[cur.point][cur.level] = true;

    if (cur.point === endHash) {
      if (cur.level > 0) continue;
      return cur.distance;
    }
    Object.entries(distances[cur.point])
      .map(([key, value]) => {
        let level =
          value > 1
            ? cur.level
            : isOuterRing(arr, cur.point)
            ? cur.level - 1
            : cur.level + 1;
        return {
          point: key,
          distance: cur.distance + value,
          level,
          path: [...cur.path, [key, level]]
        };
      })
      .forEach(pot => {
        potential.push(pot);
      });
  }
  return -1;
}

function read(error, file) {
  const arr = parseInput(file);

  const portals = getPortals(arr);

  const distances = calcDistances(arr, portals);

  const small = shortest(arr, portals, distances);
  console.log(small);
}

fs.readFile("./i.txt", "UTF8", read);
