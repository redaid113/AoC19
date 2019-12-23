const fs = require("fs");
const IntCode = require("../IntCode");
function parseInput(file) {
  return file.split(",").map(num => parseInt(num));
}

class NIC {
  constructor(id, arr) {
    this.intCode = new IntCode(arr);
    this.iter = this.intCode.iter();
    this.iter.next();
    this.iter.next(id);
  }

  getOutputs() {
    const output = [];
    while (this.intCode.output.length > 0) {
      const id = this.intCode.output.shift();
      const x = this.intCode.output.shift();
      const y = this.intCode.output.shift();
      output.push({ id, x, y });
    }

    return output;
  }

  input(x, y) {
    this.iter.next(x);
    this.iter.next(y);
  }

  nothing() {
    this.iter.next(-1);
  }
}

function read(error, file) {
  const arr = parseInput(file);

  const NICs = [];
  for (let i = 0; i < 50; i++) {
    NICs[i] = new NIC(i, arr);
  }

  let run = true;
  while (run) {
    const outputs = [];
    for (let i = 0; i < 50; i++) {
      outputs[i] = [];
    }

    NICs.forEach(nic => {
      nic.getOutputs().forEach(({ id, x, y }) => {
        if (id === 255) {
          console.log(y);
          run = false;
          return;
        }
        outputs[id].push({ x, y });
      });
    });

    for (let i = 0; i < 50; i++) {
      if (outputs[i].length === 0) {
        NICs[i].nothing();
      } else {
        outputs[i].forEach(({ x, y }) => {
          NICs[i].input(x, y);
        });
      }
    }
  }
}

fs.readFile("./i.txt", "UTF8", read);
