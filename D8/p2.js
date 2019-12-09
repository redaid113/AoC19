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

function getImage(layers) {
  layers.reverse();
  const image = layers[0];

  layers.forEach(layer => {
    layer.forEach((num, index) => {
      if (num !== 2) {
        image[index] = num;
      }
    });
  });
  return image;
}

function printImage(image) {
  for (let i = 0; i < 6; i++) {
    let line = "";
    for (let j = 0; j < 25; j++) {
      const pixel = image[i * 25 + j];
      line += pixel !== 0 ? "■" : " ";
    }
    console.log(line);
  }
}

function read(error, text) {
  const arr = parseInput(text);
  const layers = getLayers(arr);

  const image = getImage(layers);
  printImage(image);
}
fs.readFile("./t.txt", "UTF8", read);
