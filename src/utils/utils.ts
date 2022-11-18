import { Box } from "./classes";

export const initializeGrid = (rows: number, cols: number) => {
  const initialArray = new Array(rows).fill(new Array(cols));
  for (let i = 0; i < initialArray.length; i++) {
    for (let j = 0; j < initialArray[i].length; j++) {
      initialArray[i][j] = new Box({ boxType: 4, weight: 1 });
    }
  }
  // set start node
  initialArray[Math.floor(rows / 2)][Math.floor(cols / 4)].boxType = 0;
  // set target node
  initialArray[Math.floor(rows / 2)][Math.floor((3 * cols) / 4)].boxType = 1;
  return initialArray;
};
