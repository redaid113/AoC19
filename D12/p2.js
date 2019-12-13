const fs = require("fs");

class Moon {
  constructor(x, y, z) {
    this.position = { x, y, z };
    this.velocity = { x: 0, y: 0, z: 0 };
  }

  change(moon, key) {
    if (moon.position[key] === this.position[key]) {
      return 0;
    }
    if (moon.position[key] > this.position[key]) {
      return 1;
    }
    return -1;
  }

  updateVelocity(moon) {
    this.velocity = {
      x: this.velocity.x + this.change(moon, "x"),
      y: this.velocity.y + this.change(moon, "y"),
      z: this.velocity.z + this.change(moon, "z")
    };
  }

  move() {
    this.position = {
      x: this.position.x + this.velocity.x,
      y: this.position.y + this.velocity.y,
      z: this.position.z + this.velocity.z
    };
  }

  kineticEnergy() {
    return (
      Math.abs(this.velocity.x) +
      Math.abs(this.velocity.y) +
      Math.abs(this.velocity.z)
    );
  }

  potentialEnergy() {
    return (
      Math.abs(this.position.x) +
      Math.abs(this.position.y) +
      Math.abs(this.position.z)
    );
  }

  totalEnergy() {
    return this.kineticEnergy() * this.potentialEnergy();
  }
}

function createMoon(line) {
  const r = /-?\d+/g;
  const [x, y, z] = line.match(r).map(num => parseInt(num));
  return new Moon(x, y, z);
}

function parseInput(input) {
  return input
    .trim()
    .split("\n")
    .map(line => createMoon(line));
}

function stepsUntilMatch(moons, initial, key) {
  let steps = 0;
  while (true) {
    steps++;
    for (let i = 0; i < moons.length; i++) {
      for (let j = i; j < moons.length; j++) {
        moons[i].updateVelocity(moons[j]);
        moons[j].updateVelocity(moons[i]);
      }
    }
    moons.forEach(moon => moon.move());
    if (
      moons.every((moon, i) => {
        return (
          moon.position[key] === initial[i].position[key] &&
          moon.velocity[key] === initial[i].velocity[key]
        );
      })
    ) {
      return steps;
    }
  }
}

const gcd = (a, b) => (!b ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

function read(error, text) {
  const initial = parseInput(text);

  const xSteps = stepsUntilMatch(parseInput(text), initial, "x");
  const ySteps = stepsUntilMatch(parseInput(text), initial, "y");
  const zSteps = stepsUntilMatch(parseInput(text), initial, "z");

  console.log(lcm(lcm(xSteps, ySteps), zSteps));
}

fs.readFile("./i.txt", "UTF8", read);
