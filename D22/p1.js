const fs = require("fs");

const DECK_SIZE = 10007;

const NEW_STACK = 0;
const CUT = 1;
const INCREMENT = 2;

function parseLine(line) {
  if (line.includes("deal into new stack")) {
    return { type: NEW_STACK };
  }

  if (line.includes("cut")) {
    return { type: CUT, N: parseInt(line.replace("cut", "").trim()) };
  }

  return {
    type: INCREMENT,
    N: parseInt(line.replace("deal with increment", "").trim())
  };
}

function parseInput(file) {
  return file
    .trim()
    .split("\n")
    .map(line => parseLine(line));
}

class Deck {
  constructor() {
    this.cards = [];
    for (let i = 0; i < DECK_SIZE; i++) {
      this.cards[i] = i;
    }
  }

  newStack() {
    this.cards.reverse();
  }

  cutNCards(N) {
    this.cards = [...this.cards.slice(N), ...this.cards.slice(0, N)];
  }

  dealWithIncrement(N) {
    let temp = [];
    let ct = 0;
    for (let i = 0; ct < DECK_SIZE; i = (i + N) % DECK_SIZE) {
      temp[i] = this.cards[ct];
      ct += 1;
    }
    this.cards = temp;
  }
}

function read(error, file) {
  const arr = parseInput(file);

  const deck = new Deck();

  arr.forEach(({ type, N }) => {
    switch (type) {
      case NEW_STACK:
        deck.newStack();
        break;
      case CUT:
        deck.cutNCards(N);
        break;
      case INCREMENT:
        deck.dealWithIncrement(N);
        break;
    }
  });

  // console.log(deck.cards);
  console.log(deck.cards.findIndex(card => card === 2019));
}

fs.readFile("./i.txt", "UTF8", read);
