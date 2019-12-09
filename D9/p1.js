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
    //arr[arr[this.position + 3]] = p1 + p2;
  }

  multiple(arr, instruction) {
    const p1 = this.getValue(arr, this.position + 1, instruction.p1);
    const p2 = this.getValue(arr, this.position + 2, instruction.p2);
    this.store(arr, instruction.p3, this.position + 3, p1 * p2);

    // arr[arr[this.position + 3]] = p1 * p2;
  }

  storeInput(arr, instruction) {
    this.store(arr, instruction.p1, this.position + 1, this.input.shift());

    // arr[arr[this.position + 1]] = ;
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
      // arr[arr[this.position + 3]] = 1;
      return;
    }
    this.store(arr, instruction.p3, this.position + 3, 0);

    arr[arr[this.position + 3]] = 0;
  }

  equals(arr, instruction) {
    const p1 = this.getValue(arr, this.position + 1, instruction.p1);
    const p2 = this.getValue(arr, this.position + 2, instruction.p2);
    if (p1 === p2) {
      this.store(arr, instruction.p3, this.position + 3, 1);

      // arr[arr[this.position + 3]] = 1;
      return;
    }
    this.store(arr, instruction.p3, this.position + 3, 0);

    arr[arr[this.position + 3]] = 0;
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

function parseInput(input) {
  return input
    .trim()
    .split(",")
    .map(str => parseInt(str));
}

function read(error, text) {
  const arr = parseInput(text);

  const A = new IntCode(arr);
  const iterA = A.iter();
  A.input = [1];
  const output = [];
  while (!A.stop) {
    output.push(iterA.next().value);
  }
  console.log(output);
}

fs.readFile("./i.txt", "UTF8", read);
