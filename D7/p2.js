const fs = require("fs");

class IntCode {
  constructor(instructions) {
    this.instructions = [...instructions];
    this.position = 0;
    this.stop = false;
    this.input = [];
  }

  iter() {
    return this[Symbol.iterator]();
  }

  getValue(arr, i, mode) {
    if (mode === 0) {
      return arr[arr[i]];
    }
    return arr[i];
  }

  add(arr, instruction) {
    const p1 = this.getValue(arr, this.position + 1, instruction.p1);
    const p2 = this.getValue(arr, this.position + 2, instruction.p2);

    arr[arr[this.position + 3]] = p1 + p2;
  }

  multiple(arr, instruction) {
    const p1 = this.getValue(arr, this.position + 1, instruction.p1);
    const p2 = this.getValue(arr, this.position + 2, instruction.p2);
    arr[arr[this.position + 3]] = p1 * p2;
  }

  storeInput(arr, instruction) {
    arr[arr[this.position + 1]] = this.input.shift();
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
      arr[arr[this.position + 3]] = 1;
      return;
    }
    arr[arr[this.position + 3]] = 0;
  }

  equals(arr, instruction) {
    const p1 = this.getValue(arr, this.position + 1, instruction.p1);
    const p2 = this.getValue(arr, this.position + 2, instruction.p2);
    if (p1 == p2) {
      arr[arr[this.position + 3]] = 1;
      return;
    }
    arr[arr[this.position + 3]] = 0;
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

function perm(xs) {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

    if (!rest.length) {
      ret.push([xs[i]]);
    } else {
      for (let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]));
      }
    }
  }
  return ret;
}

function getThrusterPower(instructions, phases, initial) {
  let ret = [];
  const big = phases.reduce((max, phaseList) => {
    const A = new IntCode(instructions);
    const iterA = A.iter();
    A.input.push(phaseList[0], 0);
    const B = new IntCode(instructions);
    const iterB = B.iter();
    B.input.push(phaseList[1]);
    const C = new IntCode(instructions);
    const iterC = C.iter();
    C.input.push(phaseList[2]);
    const D = new IntCode(instructions);
    const iterD = D.iter();
    D.input.push(phaseList[3]);
    const E = new IntCode(instructions);
    const iterE = E.iter();
    E.input.push(phaseList[4]);

    let output = 0;
    do {
      const aVal = iterA.next().value;
      B.input.push(aVal);
      const bVal = iterB.next().value;
      C.input.push(bVal);
      const cVal = iterC.next().value;
      D.input.push(cVal);
      const dVal = iterD.next().value;
      E.input.push(dVal);
      const eVal = iterE.next().value;
      A.input.push(eVal);
      if (E.stop) break;
      output = eVal;
    } while (true);

    if (output > max) {
      ret = phaseList;
    }
    return Math.max(max, output);
  }, 0);
  return [ret, big];
}

function read(error, text) {
  const arr = parseInput(text);

  const phases = perm([5, 6, 7, 8, 9]);

  const [ret, big] = getThrusterPower(arr, phases, 0);
  console.log(big);
  console.log(ret.join(""));
}

fs.readFile("./t.txt", "UTF8", read);
