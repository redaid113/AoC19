const fs = require("fs");

class IntCode {
  constructor(instructions) {
    this.instructions = [...instructions];
    this.position = 0;
    this.relativeBase = 0;
    this.stop = false;
    this.output = [];
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

  storeInput(arr, instruction, input) {
    this.store(arr, instruction.p1, this.position + 1, input);
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
          this.storeInput(arr, inst, yield);
          this.position += 2;
          break;
        case 4:
          ret = this.storeOutput(arr, inst);
          this.position += 2;
          this.output.push(ret);
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

function parseInput(input) {
  return input
    .trim()
    .split(",")
    .map(line => parseInt(line));
}

function getPoints(arr) {
  let points = [];
  for (let i = 0; i < arr.length; i += 3) {
    points.push({ x: arr[i], y: arr[i + 1], id: arr[i + 2] });
  }
  return points;
}

function getPaddleDirection(points) {
  points.reverse();
  const ball = points.find(p => p.id === 4);
  const paddle = points.find(p => p.id === 3);
  if (ball.x > paddle.x) return 1;
  if (ball.x < paddle.x) return -1;
  return 0;
}

function getScore(points) {
  const scores = points.filter(({ x, y }) => x === -1 && y === 0);
  return scores[scores.length - 1].id;
}

function run(arr) {
  const code = new IntCode(arr);
  const iter = code.iter();

  iter.next();
  while (!code.stop) {
    const points = getPoints(code.output);
    const dir = getPaddleDirection(points);
    iter.next(dir);
  }

  const finalPoints = getPoints(code.output);
  console.log(getScore(finalPoints));
}

function read(error, text) {
  const arr = parseInput(text);
  arr[0] = 2;
  run(arr);
}

fs.readFile("./i.txt", "UTF8", read);
