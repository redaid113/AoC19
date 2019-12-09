const fs = require("fs");

function parseInput(input) {
  return input
    .trim()
    .split("")
    .map(str => parseInt(str));
}

function getLayers(arr) {
  let layers = [];
  while (arr.length > 0) {
    layers.push(arr.splice(0, 25 * 6));
  }
  return layers;
}

function read(error, text) {
  const arr = parseInput(text);
  const layers = getLayers(arr);

  let zeroLayer = [];
  let zeroCt = Number.MAX_SAFE_INTEGER;
  layers.forEach(layer => {
    const ct = layer.filter(num => num === 0).length;
    if (ct < zeroCt) {
      zeroCt = ct;
      zeroLayer = layer;
    }
  });

  const ones = zeroLayer.filter(num => num === 1).length;
  const twos = zeroLayer.filter(num => num === 2).length;
  console.log(ones * twos);
}
fs.readFile("./t.txt", "UTF8", read);
