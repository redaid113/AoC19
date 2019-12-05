const fs = require("fs");

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

function opcode(arr, input) {
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
        storeInput(arr, pos, inst, input);
        pos += 2;
        break;
      case 4:
        ret = storeOutput(arr, pos, inst);
        console.log(ret);
        pos += 2;
        break;
      case 99:
      default:
        return ret;
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

  const input = 1;

  const output = opcode(arr, input);

  console.log(output);
}

fs.readFile("./i1.txt", "UTF8", read);
