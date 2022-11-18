import React from "react";
import { Box } from "../utils/classes";
import "./grid.css";

type GridProps = {
  grid: Box[][];
};

const Grid = (props: GridProps) => {
  const grid = props.grid;
  return (
    <div className="grid-container">
      {grid.map((row, idx) => (
        <div className="grid-row" key={`row-${idx}`}>
          {row.map((box, colIdx) => (
            <div className="grid-box" key={`box-${idx}_${colIdx}`}></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
