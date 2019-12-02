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

let test1 = [1, 0, 0, 0, 99];
opcode(test1);
console.log(test1); // [2,0,0,0,99]

let test2 = [2, 3, 0, 3, 99];
opcode(test2);
console.log(test2); // [2,3,0,6,99]

let test3 = [2, 4, 4, 5, 99, 0];
opcode(test3);
console.log(test3); // [2,4,4,5,99,9801]

let test4 = [1, 1, 1, 4, 99, 5, 6, 0, 99];
opcode(test4);
console.log(test4); // [30,1,1,4,2,5,6,0,99]

function parseInput(input) {
  return input
    .trim()
    .split(",")
    .map(str => parseInt(str));
}

function read(error, input) {
  const arr = parseInput(input);
  arr[1] = 12;
  arr[2] = 2;

  opcode(arr);

  console.log(arr[0]);
}

fs.readFile("./i1.txt", "UTF8", read);
