const fs = require("fs");

function parseInput(input) {
  return input
    .trim()
    .split("\n")
    .reduce((map, line) => {
      const [input, output] = line.split(" => ");
      const [outNum, chemical] = output.trim().split(" ");
      map[chemical] = {
        quantity: parseInt(outNum),
        input: input
          .split(",")
          .map(l => l.trim("").split(" "))
          .map(arr => ({ quantity: parseInt(arr[0]), chemical: arr[1] }))
      };
      return map;
    }, {});
}

function getOreCount(map, goal = 1) {
  let materials = map["FUEL"].input.map(i => ({
    quantity: i.quantity * goal,
    chemical: i.chemical
  }));
  let excess = {};
  excess["ORE"] = 0;
  Object.keys(map).forEach(key => (excess[key] = 0));

  while (materials.length > 1 || materials[0].chemical !== "ORE") {
    // console.log(materials);
    const raw = materials.map(chem => {
      if (!map[chem.chemical]) return [chem];

      const { quantity, input } = map[chem.chemical];
      const times = Math.ceil(chem.quantity / quantity);

      const next = input.map(i => ({
        quantity: i.quantity * times,
        chemical: i.chemical
      }));

      if (quantity * times !== chem.quantity) {
        excess[chem.chemical] = quantity * times - chem.quantity;
      }
      return next;
    });
    materials = raw
      .reduce((arr, val) => [...arr, ...val], [])
      .reduce((arr, val) => {
        const a = arr.find(x => x.chemical === val.chemical);
        if (!a) {
          arr.push(val);
        } else {
          a.quantity += val.quantity;
        }
        return arr;
      }, []);

    // console.log(excess);
    materials.forEach(material => {
      material.quantity -= excess[material.chemical];
      excess[material.chemical] = 0;
    });
  }
  //   console.log(excess);

  return materials[0].quantity;
}

function read(error, text) {
  const map = parseInput(text);
  const ct = getOreCount(map);

  console.log("part 1: ", ct); // 870051

  const ORE = 1000000000000;

  let low = 0;
  let big = ORE;

  while (big - low > 1) {
    const check = Math.floor((big - low) / 2 + low);
    const cur = getOreCount(map, check);
    if (cur < ORE) {
      low = check;
    } else {
      big = check;
    }
  }
  if (getOreCount(map, big) < ORE) {
    console.log(big);
  } else {
    console.log(low);
  }
}

fs.readFile("./i.txt", "UTF8", read);
