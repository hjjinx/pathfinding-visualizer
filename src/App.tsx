import React, { useEffect, useState } from "react";
import "./App.css";
import Grid from "./Grid/Grid";
import { Box } from "./utils/classes";
import { initializeGrid } from "./utils/utils";

function App() {
  const [grid, setGrid] = useState<Box[][]>(initializeGrid(30, 40));

  const toggleWallOnIndex = (i: number, j: number) => {
    setGrid(
      grid.map((row: Box[], idx) =>
        row.map((box: Box, boxIdx) => {
          if (
            idx == i &&
            boxIdx == j &&
            box.boxType !== 0 &&
            box.boxType !== 1
          ) {
            box.boxType = box.boxType == 4 ? 2 : 4;
            box.weight = 1;
          }
          return box;
        })
      )
    );
  };

  useEffect(() => {
    let mouseDownTarget: HTMLDivElement | null = null;
    let mouseDownIndex: number[] | null = null;
    let movedToTarget: HTMLDivElement | null = null;
    let movedToIndex: number[] | null = null;

    const mouseDownListener = (e: MouseEvent) => {
      if (e.target instanceof HTMLDivElement && e?.target?.dataset?.i) {
        mouseDownTarget = e.target;
        movedToTarget = e.target;
        mouseDownIndex = [
          Number(e.target.dataset.i),
          Number(e.target.dataset.j),
        ];
        movedToIndex = [Number(e.target.dataset.i), Number(e.target.dataset.j)];
        toggleWallOnIndex(movedToIndex![0], movedToIndex![1]);
      } else mouseDownTarget = null;
    };
    document
      .getElementById("grid")
      ?.addEventListener("mousedown", mouseDownListener);

    const mouseMoveListener = (e: MouseEvent) => {
      if (!mouseDownIndex) return;
      if (
        e.target instanceof HTMLDivElement &&
        movedToTarget &&
        e.target != movedToTarget
      ) {
        toggleWallOnIndex(movedToIndex![0], movedToIndex![1]);

        movedToTarget = e.target;
        movedToIndex = [Number(e.target.dataset.i), Number(e.target.dataset.j)];
      }
    };
    document
      .getElementById("grid")
      ?.addEventListener("mousemove", mouseMoveListener);

    const mouseUpListener = (e: MouseEvent) => {
      mouseDownTarget = null;
      mouseDownIndex = null;
      movedToTarget = null;
      movedToIndex = null;
    };
    window?.addEventListener("mouseup", mouseUpListener);

    return () => {
      document
        .getElementById("grid")
        ?.removeEventListener("mousedown", mouseDownListener);
      window?.removeEventListener("mousedown", mouseUpListener);
      document
        .getElementById("grid")
        ?.removeEventListener("mousemove", mouseMoveListener);
    };
  }, []);

  return (
    <div className="App">
      {/* Controls */}
      <Grid grid={grid} />
    </div>
  );
}

export default App;
