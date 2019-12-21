const fs = require("fs");
const IntCode = require("../IntCode");

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
    if (
      !ret.includes("Didn't make it across") &&
      !ret.includes("Input instructions:")
    ) {
      const final = this.output[this.output.length - 1];
      return `Damage: ${final}`;
    }
    this.output = [];
    return ret;
  }

  walk(arr) {
    this.next([...arr, "WALK"].join("\n"));
    this.next("\n");
  }

  run(arr) {
    this.next([...arr, "RUN"].join("\n"));
    this.next("\n");
  }
}

function parseInput(file) {
  return file
    .trim()
    .split(",")
    .map(num => parseInt(num));
}

// Jumps: To spot 4 away

// J = JUMP
// T = Temp

// Hole distance = false
// A - 1
// B - 2
// C - 3
// D - 4

// E - 5
// F - 6
// G - 7
// H - 8
// I - 9

// OR
// AND
// NOT

// Potential ground
// #####.###########
// #####...#########
// #####..#.########
function goSlowly(arr) {
  const INSTRUCTIONS = [
    // Next is line?
    "NOT A J",
    // 3 hole, 4 ground?
    "NOT C T",
    "AND D T",
    "OR T J"
  ];
  const Ascii = new AsciiIntCode(arr);

  console.log("\n\nPART 1:");
  console.log(Ascii.out());
  console.log(INSTRUCTIONS.join("\n"));
  Ascii.walk(INSTRUCTIONS);
  console.log(Ascii.out());
}

// #####.###########
// #####...#########
// #####..#.########
// #####.#.##...####
// #####.##...#.####
function quickQuickLikeAShark(arr) {
  const INSTRUCTIONS = [
    // 1 hole
    "NOT A J",
    // 3 hole + 4 ground + 8 ground
    "NOT C T",
    "AND D T",
    "AND H T",
    "OR T J",

    // 2 hole + 4 ground + 8 ground
    "NOT B T",
    "AND D T",
    "AND H T",
    "OR T J"
  ];
  const Ascii = new AsciiIntCode(arr);

  console.log("\n\nPART 2:");
  console.log(Ascii.out());
  console.log(INSTRUCTIONS.join("\n"));
  Ascii.run(INSTRUCTIONS);
  console.log(Ascii.out());
}

function read(error, file) {
  const arr = parseInput(file);

  goSlowly(arr);
  quickQuickLikeAShark(arr);
}

fs.readFile("./i.txt", "UTF8", read);
