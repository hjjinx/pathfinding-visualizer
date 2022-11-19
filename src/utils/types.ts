// 0 = start node
// 1 = target
// 2 = wall (default weight = 1)
// 3 = visited node
// 4 = unvisited node
// 5 = path node
export type BoxType = 0 | 1 | 2 | 3 | 4 | 5;

export type BoxProps = {
  boxType: BoxType;
  weight: number;
  previousBox?: [number, number];
};

export type Algorithms = "Breadth First Search" | "Depth First Search";
