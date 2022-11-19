import React, { useEffect, useState } from "react";
import "./App.css";
import Grid from "./Grid/Grid";
import { Box } from "./utils/classes";
import { BoxProps } from "./utils/types";
import { getBoxClass, initializeGrid } from "./utils/utils";

function App() {
  const [size, setSize] = useState([30, 40]);
  const [grid, setGrid] = useState<Box[][]>(initializeGrid(size[0], size[1]));
  const sleep = async () =>
    await new Promise((resolve, reject) => setTimeout(resolve, 1));

  const updateBox = (i: number, j: number, newBox: BoxProps) => {
    document.getElementById(`box-${i}_${j}`)!.className = getBoxClass(
      newBox.boxType
    );
    grid[i][j].boxType = newBox.boxType;
    grid[i][j].weight = newBox.weight;
    if (newBox.previousBox) grid[i][j].previousBox = newBox.previousBox;
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

        const box = grid[movedToIndex![0]][movedToIndex![1]];
        if (box.boxType !== 0 && box.boxType !== 1)
          updateBox(movedToIndex![0], movedToIndex![1], {
            boxType: box.boxType == 2 ? 4 : 2,
            weight: 1,
          });
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
        const box = grid[movedToIndex![0]][movedToIndex![1]];
        if (box.boxType !== 0 && box.boxType !== 1)
          updateBox(movedToIndex![0], movedToIndex![1], {
            boxType: box.boxType == 2 ? 4 : 2,
            weight: 1,
          });

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
    setGrid(
      grid.map((row: Box[], idx) =>
        row.map((box: Box, boxIdx) => {
          if (box.boxType == 3 || box.boxType == 5) {
            box.boxType = 4;
            document.getElementById(`box-${idx}_${boxIdx}`)!.className =
              getBoxClass(4);
          }
          box.previousBox = undefined;
          return box;
        })
      )
    );
    // using BFS
    performBFS();
  };

  const performBFS = async () => {
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
      const i = node![0];
      const j = node![1];
      if (i - 1 >= 0) {
        if (grid[i - 1][j].boxType == 1) {
          updateBox(i - 1, j, { boxType: 1, weight: 1, previousBox: [i, j] });
          break;
        }
        if (grid[i - 1][j].boxType == 4) {
          updateBox(i - 1, j, { boxType: 3, weight: 1, previousBox: [i, j] });
          queue.push([i - 1, j]);
        }
      }
      if (j + 1 < size[1]) {
        if (grid[i][j + 1].boxType == 1) {
          updateBox(i, j + 1, { boxType: 1, weight: 1, previousBox: [i, j] });
          break;
        }
        if (grid[i][j + 1].boxType == 4) {
          updateBox(i, j + 1, { boxType: 3, weight: 1, previousBox: [i, j] });
          queue.push([i, j + 1]);
        }
      }
      if (i + 1 < size[0]) {
        if (grid[i + 1][j].boxType == 1) {
          updateBox(i + 1, j, { boxType: 1, weight: 1, previousBox: [i, j] });
          break;
        }
        if (grid[i + 1][j].boxType == 4) {
          updateBox(i + 1, j, { boxType: 3, weight: 1, previousBox: [i, j] });
          queue.push([i + 1, j]);
        }
      }
      if (j - 1 >= 0) {
        if (grid[i][j - 1].boxType == 1) {
          updateBox(i, j - 1, { boxType: 1, weight: 1, previousBox: [i, j] });
          break;
        }
        if (grid[i][j - 1].boxType == 4) {
          updateBox(i, j - 1, { boxType: 3, weight: 1, previousBox: [i, j] });
          queue.push([i, j - 1]);
        }
      }
      await sleep();
    }
    let box = grid[target[0]][target[1]];
    if (!box.previousBox) return;
    let previousBox = grid[box.previousBox![0]][box.previousBox![1]];
    while (box.previousBox) {
      updateBox(box.previousBox[0], box.previousBox[1], {
        boxType: 5,
        weight: 1,
      });
      await sleep();
      box = previousBox;
      previousBox =
        grid[previousBox.previousBox![0]][previousBox.previousBox![1]];
      if (previousBox.boxType == 0) break;
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
