const fs = require("fs");

function parseInput(file) {
  return file
    .trim()
    .split("")
    .map(num => parseInt(num));
}

function calulateDigit(input, pattern, digit) {
  let p = 0;
  let ct = 1;
  const value = input
    .map((num, index) => {
      if (ct === digit) {
        ct = 0;
        p = (p + 1) % pattern.length;
      }
      const output = num * pattern[p];
      ct += 1;
      return output;
    })
    .reduce((sum, num) => sum + num, 0);

  return Math.abs(value % 10);
}

function getOutput(input, pattern = [0, 1, 0, -1]) {
  const newArr = input.map((num, index) =>
    calulateDigit(input, pattern, index + 1)
  );
  return newArr;
}

function read(error, file) {
  const arr = parseInput(file);
  let input = arr;
  for (let i = 0; i < 100; i++) {
    input = getOutput(input);
  }
  console.log(input.join(""));
}

fs.readFile("./i.txt", "UTF8", read);
