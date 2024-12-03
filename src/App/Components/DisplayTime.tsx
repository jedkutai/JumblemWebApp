import React from "react";
import { Typography } from "@mui/material";

interface DisplayTimeProps {
  timeRemaining: number;
}

export const DisplayTime: React.FC<DisplayTimeProps> = ({ timeRemaining }) => {
  const formatTime = (): string => {
    if (timeRemaining <= 0) {
      return "0";
    }

    if (timeRemaining > 10) {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = Math.floor(timeRemaining % 60);
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return timeRemaining.toFixed(0);
  };

  return (
    <Typography
      variant="h6"
      style={{
        color: "black",
        fontWeight: "bold",
        padding: "0px",
        margin: "0px"
      }}
    >
      {formatTime()}
    </Typography>
  );
};
