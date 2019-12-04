// 367479  is 367777
// 893698  is 889999

function count() {
  let ct = 0;
  for (let d1 = 3; d1 <= 8; d1++) {
    for (let d2 = d1; d2 <= 9; d2++) {
      for (let d3 = d2; d3 <= 9; d3++) {
        for (let d4 = d3; d4 <= 9; d4++) {
          for (let d5 = d4; d5 <= 9; d5++) {
            for (let d6 = d5; d6 <= 9; d6++) {
              const sameDigit =
                d1 === d2 || d2 == d3 || d3 === d4 || d4 === d5 || d5 === d6;
              const num =
                d1 * 100000 +
                d2 * 10000 +
                d3 * 1000 +
                d4 * 100 +
                d5 * 10 +
                d6 * 1;
              const inRange = num > 367479 && num < 893698;

              if (sameDigit && inRange) {
                console.log(num);
                ct += 1;
              }
            }
          }
        }
      }
    }
  }
  return ct;
}

console.log(count());
