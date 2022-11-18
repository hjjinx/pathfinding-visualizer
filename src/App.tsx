import React, { useState } from "react";
import "./App.css";
import Grid from "./Grid/Grid";
import { Box } from "./utils/classes";
import { initializeGrid } from "./utils/utils";

function App() {
  const [grid, setGrid] = useState<Box[][]>(initializeGrid(30, 40));
  return (
    <div className="App">
      {/* Controls */}
      <Grid grid={grid} />
    </div>
  );
}

export default App;
