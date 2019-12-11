const fs = require("fs");

class IntCode {
  constructor(instructions) {
    this.instructions = [...instructions];
    this.position = 0;
    this.relativeBase = 0;
    this.stop = false;
    this.input = [];
  }

  iter() {
    return this[Symbol.iterator]();
  }

  getSomeValue(arr, i, mode) {
    if (mode === 0) {
      return arr[arr[i]];
    } else if (mode === 1) {
      return arr[i];
    }
    return arr[arr[i] + this.relativeBase];
  }

  getValue(arr, i, mode) {
    const val = this.getSomeValue(arr, i, mode);
    if (val === undefined) return 0;
    return val;
  }

  store(arr, mode, i, value) {
    if (mode === 2) {
      arr[arr[i] + this.relativeBase] = value;
    } else {
      arr[arr[i]] = value;
    }
  }

  add(arr, instruction) {
    const p1 = this.getValue(arr, this.position + 1, instruction.p1);
    const p2 = this.getValue(arr, this.position + 2, instruction.p2);
    this.store(arr, instruction.p3, this.position + 3, p1 + p2);
  }

  multiple(arr, instruction) {
    const p1 = this.getValue(arr, this.position + 1, instruction.p1);
    const p2 = this.getValue(arr, this.position + 2, instruction.p2);
    this.store(arr, instruction.p3, this.position + 3, p1 * p2);
  }

  storeInput(arr, instruction) {
    this.store(arr, instruction.p1, this.position + 1, this.input.shift());
  }

  storeOutput(arr, instruction) {
    return this.getValue(arr, this.position + 1, instruction.p1);
  }

  jumpIfTrue(arr, instruction) {
    const p1 = this.getValue(arr, this.position + 1, instruction.p1);
    if (p1 !== 0) {
      return this.getValue(arr, this.position + 2, instruction.p2);
    }
    return this.position + 3;
  }

  jumpIfFalse(arr, instruction) {
    const p1 = this.getValue(arr, this.position + 1, instruction.p1);
    if (p1 === 0) {
      return this.getValue(arr, this.position + 2, instruction.p2);
    }
    return this.position + 3;
  }

  lessThan(arr, instruction) {
    const p1 = this.getValue(arr, this.position + 1, instruction.p1);
    const p2 = this.getValue(arr, this.position + 2, instruction.p2);
    if (p1 < p2) {
      this.store(arr, instruction.p3, this.position + 3, 1);
      return;
    }
    this.store(arr, instruction.p3, this.position + 3, 0);
  }

  equals(arr, instruction) {
    const p1 = this.getValue(arr, this.position + 1, instruction.p1);
    const p2 = this.getValue(arr, this.position + 2, instruction.p2);
    if (p1 === p2) {
      this.store(arr, instruction.p3, this.position + 3, 1);
      return;
    }
    this.store(arr, instruction.p3, this.position + 3, 0);
  }

  setRelative(arr, instruction) {
    const p1 = this.getValue(arr, this.position + 1, instruction.p1);
    this.relativeBase = this.relativeBase + p1;
  }

  parseInstruction(instruction) {
    const str = `${instruction}`;
    const op = parseInt(str.substr(-2));
    const arr = `${str}`.split("");
    arr.pop();
    arr.pop();

    const p1 = parseInt(arr.pop()) || 0;
    const p2 = parseInt(arr.pop()) || 0;
    const p3 = parseInt(arr.pop()) || 0;
    return {
      op,
      p1,
      p2,
      p3
    };
  }

  *[Symbol.iterator]() {
    let ret = 0;
    let arr = this.instructions;
    for (; this.position < this.instructions.length; ) {
      const inst = this.parseInstruction(arr[this.position]);
      switch (inst.op) {
        case 1:
          this.add(arr, inst);
          this.position += 4;
          break;
        case 2:
          this.multiple(arr, inst);
          this.position += 4;
          break;
        case 3:
          this.storeInput(arr, inst);
          this.position += 2;
          break;
        case 4:
          ret = this.storeOutput(arr, inst);
          this.position += 2;
          yield ret;
          break;
        case 5:
          this.position = this.jumpIfTrue(arr, inst);
          break;
        case 6:
          this.position = this.jumpIfFalse(arr, inst);
          break;
        case 7:
          this.lessThan(arr, inst);
          this.position += 4;
          break;
        case 8:
          this.equals(arr, inst);
          this.position += 4;
          break;
        case 9:
          this.setRelative(arr, inst);
          this.position += 2;
          break;
        case 99:
        default:
          this.stop = true;
          return;
      }
    }
  }
}

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

class Robot {
  constructor(instructions) {
    this.direction = UP;
    this.location = { x: 0, y: 0 };
    this.brain = new IntCode(instructions);
    this.brainIter = this.brain.iter();

    this.map = {};
  }

  getColourWithCord(x, y) {
    const yArr = this.map[y];
    if (yArr) {
      return yArr[x] || 0;
    } else {
      return 0;
    }
  }

  getColour() {
    return this.getColourWithCord(this.location.x, this.location.y);
  }

  paint(color) {
    const yArr = this.map[this.location.y];
    if (yArr) {
      yArr[this.location.x] = color;
    } else {
      this.map[this.location.y] = { [this.location.x]: color };
    }
  }

  turn(turnDirection) {
    if (turnDirection === 0) {
      this.direction = (this.direction + 4 - 1) % 4;
    } else {
      this.direction = (this.direction + 1) % 4;
    }
  }

  move() {
    switch (this.direction) {
      case UP:
        this.location = { x: this.location.x, y: this.location.y + 1 };
        break;
      case RIGHT:
        this.location = { x: this.location.x + 1, y: this.location.y };
        break;
      case DOWN:
        this.location = { x: this.location.x, y: this.location.y - 1 };
        break;
      case LEFT:
        this.location = { x: this.location.x - 1, y: this.location.y };
        break;
    }
  }

  run() {
    let ct = 0;
    while (!this.brain.stop) {
      const curColour = ct++ > 0 ? this.getColour() : 1;
      this.brain.input.push(curColour);

      const nextColour = this.brainIter.next().value;
      this.paint(nextColour);

      if (this.brain.stop) return;

      const turnDirection = this.brainIter.next().value;
      this.turn(turnDirection);
      this.move();
    }
  }

  paintedOnce() {
    let ct = 0;
    Object.keys(this.map).forEach(y => {
      ct += Object.keys(this.map[y]).length;
    });
    return ct;
  }

  print() {
    function sortNumber(a, b) {
      return a - b;
    }

    const ys = Object.keys(this.map)
      .map(c => parseInt(c))
      .sort(sortNumber);
    const minY = ys[0];
    const maxY = ys[ys.length - 1];
    const xxx = ys.map(y => {
      const xs = Object.keys(this.map[y])
        .map(c => parseInt(c))
        .sort(sortNumber);
      return [xs[0], xs[xs.length - 1]];
    });
    const minX = xxx.map(x => x[0]).sort(sortNumber)[0];
    const maxX = xxx
      .map(x => x[1])
      .sort(sortNumber)
      .reverse()[0];

    for (let y = maxY; y >= minY; y--) {
      let line = "";
      for (let x = minX; x < maxX; x++) {
        const colour = this.getColourWithCord(x, y);
        if (colour !== 0) {
          line += "■";
        } else {
          line += " ";
        }
      }
      console.log(line);
    }
  }
}

function parseInput(input) {
  return input
    .trim()
    .split(",")
    .map(str => parseInt(str));
}

function read(error, text) {
  const arr = parseInput(text);

  const robot = new Robot(arr);
  robot.run();
  console.log(robot.paintedOnce());
  robot.print();
}

fs.readFile("./i.txt", "UTF8", read);
