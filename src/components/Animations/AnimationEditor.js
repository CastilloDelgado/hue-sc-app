import React from "react";
import Navbar from "../Navbar";
import { useApp } from "../../contexts/AppContext";

const AnimationEditor = () => {
  const { darkMode } = useApp();
  return (
    <>
      <Navbar />
      <div
        className={`container-fluid pt-3 ${darkMode && "bg-dark text-white"}`}
        style={{ minHeight: "95vh" }}
      >
        <div className="row justify-content-center mb-2">
          <div className="col col-lg-6">
            <h1 className="text-center">Animation Editor</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimationEditor;
