import {
  Tabs,
  Tab,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Algorithms } from "./utils/types";
import React from "react";

type HeaderProps = {
  algorithmSelected: Algorithms;
  setAlgorithmSelected: (s: Algorithms) => void;
  speed: number;
  setSpeed: (a: number) => void;
  start: () => void;
  isStarted: boolean;
};

const Header = (props: HeaderProps) => {
  const {
    algorithmSelected,
    setAlgorithmSelected,
    speed,
    setSpeed,
    isStarted,
    start,
  } = props;
  return (
    <div className="header">
      <div style={{ flex: 1 }}>
        <Tabs
          value={algorithmSelected}
          onChange={(e, newValue) => setAlgorithmSelected(newValue)}
          style={{ marginTop: 10 }}
        >
          <Tab
            label="Depth First Search"
            value="Depth First Search"
            disabled={!!isStarted}
          />
          <Tab
            label="Breadth First Search"
            value="Breadth First Search"
            disabled={!!isStarted}
          />
        </Tabs>
      </div>
      <div>
        <FormControl>
          <InputLabel id="demo-simple-select-label" style={{ color: "#aaa" }}>
            Speed
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={speed}
            label="Speed"
            onChange={(event) => setSpeed(Number(event.target.value))}
            disabled={!!isStarted}
          >
            <MenuItem value={1000}>Super Slow</MenuItem>
            <MenuItem value={100}>Slow</MenuItem>
            <MenuItem value={10}>Medium</MenuItem>
            <MenuItem value={1}>Fast</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={start}
          color="success"
          disabled={!!isStarted}
        >
          Find Path
        </Button>
      </div>
    </div>
  );
};

export default React.memo(Header);
