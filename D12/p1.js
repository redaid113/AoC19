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

function read(error, text) {
  const moons = parseInput(text);

  for (let steps = 0; steps < 1000; steps++) {
    for (let i = 0; i < moons.length; i++) {
      for (let j = i; j < moons.length; j++) {
        moons[i].updateVelocity(moons[j]);
        moons[j].updateVelocity(moons[i]);
      }
    }
    moons.forEach(moon => moon.move());
  }

  console.log(
    moons.map(moon => moon.totalEnergy()).reduce((sum, value) => sum + value, 0)
  );
}

fs.readFile("./i.txt", "UTF8", read);
