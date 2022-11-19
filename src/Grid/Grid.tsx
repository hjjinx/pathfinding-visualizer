import React from "react";
import { Box } from "../utils/classes";
import { getBoxClass, getBoxContent } from "../utils/utils";
import "./grid.css";

type GridProps = {
  grid: Box[][];
  speed: number;
};

const Grid = (props: GridProps) => {
  const { grid, speed } = props;
  return (
    <div className="grid-container" id="grid">
      {grid.map((row, idx) => (
        <div className="grid-row" key={`row-${idx}`}>
          {row.map((box, colIdx) => {
            return (
              <div
                className={getBoxClass(box.boxType)}
                data-content={getBoxContent(box)}
                data-i={idx}
                data-j={colIdx}
                key={`box-${idx}_${colIdx}`}
                id={`box-${idx}_${colIdx}`}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
