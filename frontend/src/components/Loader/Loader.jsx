import React from "react";
import "./Loader.css";
import logo from "../../assets/logo.png";
import { CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <div className="inline-loader">
      <div className="loader-wrapper">
        <img src="/circle-logo.png" alt="logo" className="loader-logo" />
        <CircularProgress
          size={100}
          thickness={1.5}
          sx={{
            color: "#f75a3e",
            position: "absolute",
          }}
        />
      </div>
    </div>
  );
};

export default Loader;
