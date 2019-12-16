const fs = require("fs");
const IntCode = require("../IntCode");

function parseInput(file) {
  return file
    .trim()
    .split("")
    .map(num => parseInt(num));
}

function read(error, file) {
  const arr = parseInput(file);

  let offset = parseInt(arr.slice(0, 7).join(""));
  let input = [];
  for (let i = 0; i < 10000; i++) {
    input.push(...arr);
  }
]  input = input.slice(offset);
  for (let i = 0; i < 100; i++) {
    for (let i = input.length - 2; i >= 0; i--) {
      input[i] = (input[i] + input[i + 1]) % 10;
    }
  }
  console.log(input.slice(0, 8).join(""));
}

fs.readFile("./i.txt", "UTF8", read);
