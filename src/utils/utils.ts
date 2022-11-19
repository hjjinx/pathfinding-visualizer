import { Box } from "./classes";
import { BoxType } from "./types";

export const initializeGrid = (rows: number, cols: number) => {
  const initialArray = <Box[][]>[];
  for (let i = 0; i < rows; i++) {
    initialArray.push([]);
    for (let j = 0; j < cols; j++) {
      initialArray[i].push(new Box({ boxType: 4, weight: 1 }));
    }
  }
  // set start node
  initialArray[Math.floor(rows / 2)][Math.floor(cols / 4)].boxType = 0;
  // set target node
  initialArray[Math.floor(rows / 2)][Math.floor((3 * cols) / 4)].boxType = 1;
  return initialArray;
};

export const getBoxClass = (boxType: BoxType) => {
  let className = "grid-box ";
  switch (boxType) {
    case 0:
      className += "start-node";
      break;
    case 1:
      className += "target-node";
      break;
    case 2:
      className += "wall-node";
      break;
    case 3:
      className += "visited-node";
      break;
    case 4:
      className += "unvisited-node";
      break;
    case 5:
      className += "path-node";
      break;
  }
  return className;
};

export const getBoxContent = ({ boxType, weight }: Box) => {
  switch (boxType) {
    case 0:
      return "Start";
    case 1:
      return "Target";
    case 2:
      return `Wall`;
    // case 3:
    //   return "Visited";
    // case 4:
    //   return "Empty";
    // case 5:
    //   return "Path";
  }
};
