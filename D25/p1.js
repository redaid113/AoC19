const fs = require("fs");
const IntCode = require("../IntCode");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

class AsciiIntCode extends IntCode {
  constructor(arr) {
    super(arr);
    this.it = super.iter();
    this.it.next();
  }

  next(input) {
    for (let i = 0; i < input.length; i++) {
      this.it.next(input.charCodeAt(i));
    }
  }

  out() {
    const ret = this.output.map(num => String.fromCharCode(num)).join("");
    this.output = [];
    return ret;
  }
}

function parseInput(file) {
  return file.split(",").map(num => parseInt(num));
}

function get(question) {
  return new Promise((resolve, reject) => {
    const s = readline.question(question, answer => {
      resolve(answer);
    });
  });
}

const INVENTORY = [
  "prime number",
  "candy cane",
  "loom",
  "asterisk",
  "food ration",
  "boulder",
  "mutex",
  "mug"
];

async function read(error, file) {
  const arr = parseInput(file);
  const droid = new AsciiIntCode(arr);

  while (!droid.stop) {
    const command = await get(droid.out());
    if (command === "test") break;
    droid.next(command);
    droid.next("\n");
  }

  let queue = INVENTORY.map(inv => [inv]);
  while (queue.length > 0) {
    const test = queue.shift();
    test.forEach(t => {
      droid.next(`take ${t}\n`);
    });

    droid.next("north");
    droid.next("\n");

    const result = droid.out();
    if (!result.includes("and you are ejected back to the checkpoint.")) {
      console.log(result);
      break;
    }

    test.forEach(t => {
      droid.next(`drop ${t}\n`);
    });

    const index = INVENTORY.findIndex(i => i === test[test.length - 1]);
    for (let i = index + 1; i < INVENTORY.length; i++) {
      queue.push([...test, INVENTORY[i]]);
    }
  }
  while (!droid.stop) {
    const command = await get(droid.out());
    if (command === "stop") break;
    droid.next(command);
    droid.next("\n");
  }

  readline.close();
}

fs.readFile("./i.txt", "UTF8", read);
