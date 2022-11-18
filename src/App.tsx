import React, { useEffect, useState } from "react";
import "./App.css";
import Grid from "./Grid/Grid";
import { Box } from "./utils/classes";
import { BoxType } from "./utils/types";
import { initializeGrid } from "./utils/utils";

function App() {
  const [size, setSize] = useState([30, 40]);
  const [grid, setGrid] = useState<Box[][]>(initializeGrid(size[0], size[1]));

  const updateGrid = (i: number, j: number, boxType: BoxType) => {
    setGrid(
      grid.map((row: Box[], idx) =>
        row.map((box: Box, boxIdx) => {
          if (
            idx == i &&
            boxIdx == j &&
            box.boxType !== 0 &&
            box.boxType !== 1
          ) {
            box.boxType = boxType;
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
        updateGrid(
          movedToIndex![0],
          movedToIndex![1],
          grid[movedToIndex![0]][movedToIndex![1]].boxType == 4 ? 2 : 4
        );
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
        updateGrid(
          movedToIndex![0],
          movedToIndex![1],
          grid[movedToIndex![0]][movedToIndex![1]].boxType == 4 ? 2 : 4
        );

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

  const findPath = () => {
    // using BFS
    performBFS();
  };

  const performBFS = () => {
    let start = [0, 0];
    let target = [0, 0];
    for (let i = 0; i < size[0]; i++) {
      for (let j = 0; j < size[1]; j++) {
        if (grid[i][j].boxType == 0) start = [i, j];
        if (grid[i][j].boxType == 1) target = [i, j];
      }
    }

    const queue = [start];

    while (queue.length > 0) {
      const node = queue.shift();
      console.log(node);
      const i = node![0];
      const j = node![1];

      if (
        i - 1 >= 0 &&
        grid[i - 1][j].boxType !== 3 &&
        grid[i - 1][j].boxType !== 2
      ) {
        if (i - 1 == target[0] && j == target[1]) return;
        else {
          updateGrid(i - 1, j, 3);
          queue.push([i - 1, j]);
        }
      }
      if (
        i + 1 < size[0] &&
        grid[i + 1][j].boxType !== 3 &&
        grid[i + 1][j].boxType !== 2
      ) {
        if (i + 1 == target[0] && j == target[1]) return;
        else {
          updateGrid(i + 1, j, 3);
          queue.push([i + 1, j]);
        }
      }
      if (
        j - 1 >= 0 &&
        grid[i][j - 1].boxType !== 3 &&
        grid[i][j - 1].boxType !== 2
      ) {
        if (i == target[0] && j - 1 == target[1]) return;
        else {
          updateGrid(i, j - 1, 3);
          queue.push([i, j - 1]);
        }
      }
      if (
        j + 1 < size[1] &&
        grid[i][j + 1].boxType !== 3 &&
        grid[i][j + 1].boxType !== 2
      ) {
        if (i == target[0] && j + 1 == target[1]) return;
        else {
          updateGrid(i, j + 1, 3);
          queue.push([i, j + 1]);
        }
      }
    }
  };

  return (
    <div className="App">
      {/* Controls */}
      <Grid grid={grid} />
      <button onClick={findPath}> Find Path</button>
    </div>
  );
}

export default App;
