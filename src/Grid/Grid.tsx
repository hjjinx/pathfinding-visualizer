import React from "react";
import { Box } from "../utils/classes";
import "./grid.css";

type GridProps = {
  grid: Box[][];
};

const Grid = (props: GridProps) => {
  return <div className="grid-container"></div>;
};

export default Grid;
