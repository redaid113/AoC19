const fs = require("fs");

function getAsteriods(arr) {
  const asteroids = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === "#") {
        asteroids.push({ point: { x: j, y: i }, angles: {} });
      }
    }
  }
  return asteroids;
}

function parseInput(input) {
  return input
    .trim()
    .split("\n")
    .map(str => str.split(""));
}

function getAngle(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.atan2(-dx, dy);
}

function updateAngles(asteroids) {
  for (let i = 0; i < asteroids.length; i++) {
    const cur = asteroids[i];
    for (let j = 0; j < asteroids.length; j++) {
      if (i == j) continue;
      const next = asteroids[j];
      const angle = getAngle(cur.point, next.point);

      if (!cur.angles[angle]) {
        cur.angles[angle] = { asteroids: [next] };
      } else {
        cur.angles[angle].asteroids.push(next);
      }
    }
  }
}

function getBestSight(asteroids) {
  updateAngles(asteroids);
  return asteroids.reduce((asteroid, cur) => {
    if (Object.keys(asteroid.angles).length > Object.keys(cur.angles).length) {
      return asteroid;
    }
    return cur;
  }, asteroids[0]);
}

function anglesArr(spot) {
  const angles = Object.keys(spot.angles);
  return angles.sort();
}

function lazer(spot) {
  const angles = anglesArr(spot);
  let ct = 0;
  for (let i = 0; ; i = (i + 1) % angles.length) {
    const angle = angles[i];
    if (spot.angles[angle].asteroids.length === 0) continue;
    ct++;
    const cur = spot.angles[angle].asteroids.shift();
    if (ct === 200) {
      return cur;
    }
  }
}

function read(error, text) {
  const arr = parseInput(text);
  const asteroids = getAsteriods(arr);

  const bestSpot = getBestSight(asteroids);
  const the200th = lazer(bestSpot);
  console.log(bestSpot.point);
  console.log(the200th.point);
  console.log(the200th.point.x * 100 + the200th.point.y);
}

fs.readFile("./i.txt", "UTF8", read);
