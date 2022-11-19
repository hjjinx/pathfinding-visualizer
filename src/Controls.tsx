import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Algorithms } from "./utils/types";

type ControlProps = {
  type: string;
  setType: (a: string) => void;
  isStarted: boolean;
};

const Controls = (props: ControlProps) => {
  const { type, setType, isStarted } = props;
  return (
    <div className="controls">
      <FormControl>
        <FormLabel>Type</FormLabel>
        <RadioGroup
          name="type-placement"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <FormControlLabel
            value="obstacle"
            control={<Radio />}
            label="Obstacle"
          />
          <FormControlLabel
            value="start"
            control={<Radio />}
            label="Start"
            disabled={isStarted}
          />
          <FormControlLabel
            value="target"
            control={<Radio />}
            label="Target"
            disabled={isStarted}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default React.memo(Controls);
