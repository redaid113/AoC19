const fs = require("fs");

function IntCode(instructions, getInput) {
  function getValue(arr, pos, mode) {
    if (mode === 0) {
      return arr[arr[pos]];
    }
    return arr[pos];
  }

  function add(arr, pos, instruction) {
    const p1 = getValue(arr, pos + 1, instruction.p1);
    const p2 = getValue(arr, pos + 2, instruction.p2);

    arr[arr[pos + 3]] = p1 + p2;
  }

  function multiple(arr, pos, instruction) {
    const p1 = getValue(arr, pos + 1, instruction.p1);
    const p2 = getValue(arr, pos + 2, instruction.p2);
    arr[arr[pos + 3]] = p1 * p2;
  }

  function storeInput(arr, pos, instruction, input) {
    arr[arr[pos + 1]] = input;
  }

  function storeOutput(arr, pos, instruction) {
    return getValue(arr, pos + 1, instruction.p1);
  }

  function jumpIfTrue(arr, pos, instruction) {
    const p1 = getValue(arr, pos + 1, instruction.p1);
    if (p1 !== 0) {
      return getValue(arr, pos + 2, instruction.p2);
    }
    return pos + 3;
  }

  function jumpIfFalse(arr, pos, instruction) {
    const p1 = getValue(arr, pos + 1, instruction.p1);
    if (p1 === 0) {
      return getValue(arr, pos + 2, instruction.p2);
    }
    return pos + 3;
  }

  function lessThan(arr, pos, instruction) {
    const p1 = getValue(arr, pos + 1, instruction.p1);
    const p2 = getValue(arr, pos + 2, instruction.p2);
    if (p1 < p2) {
      arr[arr[pos + 3]] = 1;
      return;
    }
    arr[arr[pos + 3]] = 0;
  }

  function equals(arr, pos, instruction) {
    const p1 = getValue(arr, pos + 1, instruction.p1);
    const p2 = getValue(arr, pos + 2, instruction.p2);
    if (p1 == p2) {
      arr[arr[pos + 3]] = 1;
      return;
    }
    arr[arr[pos + 3]] = 0;
  }

  function parseInstruction(instruction) {
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

  function opcode(arr) {
    let ret = 0;
    for (let pos = 0; pos < arr.length; ) {
      const inst = parseInstruction(arr[pos]);
      switch (inst.op) {
        case 1:
          add(arr, pos, inst);
          pos += 4;
          break;
        case 2:
          multiple(arr, pos, inst);
          pos += 4;
          break;
        case 3:
          storeInput(arr, pos, inst, getInput());
          pos += 2;
          break;
        case 4:
          ret = storeOutput(arr, pos, inst);
          pos += 2;
          break;
        case 5:
          pos = jumpIfTrue(arr, pos, inst);
          break;
        case 6:
          pos = jumpIfFalse(arr, pos, inst);
          break;
        case 7:
          lessThan(arr, pos, inst);
          pos += 4;
          break;
        case 8:
          equals(arr, pos, inst);
          pos += 4;
          break;
        case 99:
        default:
          return ret;
      }
    }
  }
  return opcode(instructions);
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

function read(error, text) {
  const arr = parseInput(text);

  const phases = perm([0, 1, 2, 3, 4]);
  let ret = [];
  const big = phases.reduce((max, phaseList) => {
    let input = 0;
    let output;
    for (let i = 0; i < 5; i++) {
      let a = 0;
      const getInput = () => (a++ !== 0 ? input : phaseList[i]);
      // console.log(getInput());
      // console.log(getInput());

      output = IntCode(arr, getInput);
      input = output;
      // console.log(a);
    }
    if (output > max) {
      ret = phaseList;
    }
    return Math.max(max, output);
  }, 0);
  console.log(big);
  console.log(ret.join(""));
}

fs.readFile("./t.txt", "UTF8", read);
