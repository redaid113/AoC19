const fs = require("fs");

function add(arr, pos) {
  arr[arr[pos + 3]] = arr[arr[pos + 1]] + arr[arr[pos + 2]];
}

function multiple(arr, pos) {
  arr[arr[pos + 3]] = arr[arr[pos + 1]] * arr[arr[pos + 2]];
}

function opcode(arr) {
  for (let pos = 0; pos < arr.length; pos += 4) {
    switch (arr[pos]) {
      case 1:
        add(arr, pos);
        break;
      case 2:
        multiple(arr, pos);
        break;
      case 99:
      default:
        return;
    }
  }
}

function parseInput(input) {
  return input
    .trim()
    .split(",")
    .map(str => parseInt(str));
}

function read(error, input) {
  const og = parseInput(input);
  let i;
  let j;
  for (i = 0; i <= 99; i++) {
    for (j = 0; j <= 99; j++) {
      let arr = [...og];

      arr[1] = i;
      arr[2] = j;

      opcode(arr);
      if (arr[0] === 19690720) {
        console.log(100 * i + j);
        return;
      }
    }
  }
}

fs.readFile("./i1.txt", "UTF8", read);
