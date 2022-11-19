import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./App.css";
import Controls from "./Controls";
import Grid from "./Grid/Grid";
import Header from "./Header";
import { Box } from "./utils/classes";
import { Algorithms, BoxProps } from "./utils/types";
import { getBoxClass, initializeGrid } from "./utils/utils";

const SIZE = [30, 40];

function App() {
  const [grid, setGrid] = useState<Box[][]>(initializeGrid(SIZE[0], SIZE[1]));
  const [speed, setSpeed] = useState<number>(1);
  const [algorithmSelected, setAlgorithmSelected] = useState<Algorithms>(
    "Breadth First Search"
  );
  const [isStarted, setIsStarted] = useState(false);
  const [type, setType] = useState("obstacle");

  const sleep = async (time: number) =>
    await new Promise((resolve, reject) => setTimeout(resolve, time));

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
        console.log(type);
        if (type == "start" || type == "target") {
          let start = [0, 0];
          let target = [0, 0];
          for (let i = 0; i < SIZE[0]; i++) {
            for (let j = 0; j < SIZE[1]; j++) {
              if (grid[i][j].boxType == 0) start = [i, j];
              if (grid[i][j].boxType == 1) target = [i, j];
            }
          }
          updateBox(
            type == "start" ? start[0] : target[0],
            type == "start" ? start[1] : target[1],
            {
              boxType: 4,
              weight: 1,
            }
          );
          updateBox(movedToIndex![0], movedToIndex![1], {
            boxType: type == "start" ? 0 : 1,
            weight: 1,
          });
        } else if (box.boxType !== 0 && box.boxType !== 1)
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
  }, [type]);

  const findPath = async () => {
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
    // using BFS/DFS
    setIsStarted(true);
    switch (algorithmSelected) {
      case "Breadth First Search":
        await performBruteforce(true);
        break;
      case "Depth First Search":
        await performBruteforce(false);
        break;
    }
    setIsStarted(false);
  };

  const performBruteforce = async (isBFS: boolean) => {
    let start = [0, 0];
    let target = [0, 0];
    for (let i = 0; i < SIZE[0]; i++) {
      for (let j = 0; j < SIZE[1]; j++) {
        if (grid[i][j].boxType == 0) start = [i, j];
        if (grid[i][j].boxType == 1) target = [i, j];
      }
    }

    const ds = [start];

    while (ds.length > 0) {
      const node = isBFS ? ds.shift() : ds.pop();
      const i = node![0];
      const j = node![1];
      const box = grid[i][j];
      // box is target or box is present in ds
      if (box.boxType == 1 || box.boxType == 4) {
        updateBox(i, j, {
          boxType: box.boxType == 1 ? 1 : 3,
          weight: 1,
          previousBox: [box.previousBox![0], box.previousBox![1]],
        });
        if (box.boxType == 1) break;
      }
      await sleep(speed);

      if (i - 1 >= 0) {
        const boxType = grid[i - 1][j].boxType;
        if (boxType == 4 || boxType == 1) {
          updateBox(i - 1, j, {
            boxType: isBFS ? (boxType == 4 ? 3 : 1) : boxType,
            weight: 1,
            previousBox: [i, j],
          });
          ds.push([i - 1, j]);
        }
      }
      if (j + 1 < SIZE[1]) {
        const boxType = grid[i][j + 1].boxType;
        if (boxType == 4 || boxType == 1) {
          updateBox(i, j + 1, {
            boxType: isBFS ? (boxType == 4 ? 3 : 1) : boxType,
            weight: 1,
            previousBox: [i, j],
          });
          ds.push([i, j + 1]);
        }
      }
      if (i + 1 < SIZE[0]) {
        const boxType = grid[i + 1][j].boxType;
        if (boxType == 4 || boxType == 1) {
          updateBox(i + 1, j, {
            boxType: isBFS ? (boxType == 4 ? 3 : 1) : boxType,
            weight: 1,
            previousBox: [i, j],
          });
          ds.push([i + 1, j]);
        }
      }
      if (j - 1 >= 0) {
        const boxType = grid[i][j - 1].boxType;
        if (boxType == 4 || boxType == 1) {
          updateBox(i, j - 1, {
            boxType: isBFS ? (boxType == 4 ? 3 : 1) : boxType,
            weight: 1,
            previousBox: [i, j],
          });
          ds.push([i, j - 1]);
        }
      }
    }
    let box = grid[target[0]][target[1]];
    if (!box.previousBox) return;
    let previousBox = grid[box.previousBox![0]][box.previousBox![1]];
    while (box.previousBox) {
      updateBox(box.previousBox[0], box.previousBox[1], {
        boxType: 5,
        weight: 1,
      });
      await sleep(speed + 10);
      box = previousBox;
      previousBox =
        grid[previousBox.previousBox![0]][previousBox.previousBox![1]];
      if (previousBox.boxType == 0) break;
    }
  };

  return (
    <div className="App">
      <Header
        algorithmSelected={algorithmSelected}
        setAlgorithmSelected={setAlgorithmSelected}
        speed={speed}
        setSpeed={setSpeed}
        start={findPath}
        isStarted={isStarted}
      />
      <Typography id="Heading" style={{ marginTop: 20, marginBottom: 20 }}>
        {!!isStarted ? (
          "Pathfinding in Progress. Refresh the page in order to start again."
        ) : (
          <>
            Select the pathfinding algorithm from top-left and click the Start
            button on top-right to start. <br />
            Select type of placement from left, and edit by clicking on cells in
            the grid
          </>
        )}
      </Typography>
      <main className="main">
        <Controls isStarted={isStarted} type={type} setType={setType} />
        <Grid grid={grid} speed={speed} />
      </main>
    </div>
  );
}

export default App;
