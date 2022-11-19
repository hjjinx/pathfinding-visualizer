import { BoxProps, BoxType } from "./types";

export class Box {
  boxType: BoxType;
  weight: number;
  previousBox?: [number, number];
  constructor(props: BoxProps) {
    this.boxType = props.boxType;
    this.weight = 1;
  }
}
