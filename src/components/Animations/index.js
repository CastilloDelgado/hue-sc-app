import React, { useState } from "react";
import Navbar from "../Navbar";
import AnimationBadge from "./AnimationBadge";
import { useApp } from "../../contexts/AppContext";

const Animations = () => {
  const { darkMode } = useApp();
  const [animations, setAnimations] = useState([
    {
      id: 1,
      name: "First Animation",
      description: "This is a test of the animations module.",
    },
    {
      id: 2,
      name: "Second Animation",
      description: "This is a test of the animations module.",
    },
    {
      id: 3,
      name: "Third Animation",
      description: "This is a test of the animations module.",
    },
    {
      id: 4,
      name: "Fourth Animation",
      description: "This is a test of the animations module.",
    },
  ]);

  const handleDeleteAnimationClick = (index) => {
    const _animations = [...animations];
    _animations.splice(index, 1);
    setAnimations(_animations);
  };

  return (
    <>
      <Navbar />
      <div
        className={`container-fluid pt-3 ${darkMode && "bg-dark text-white"}`}
        style={{ minHeight: "95vh" }}
      >
        <div className="row justify-content-center mb-2">
          <div className="col col-lg-6">
            <h1 className="text-center">Animations</h1>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col col-lg-8">
            <div className="container-fluid p-0 ">
              <div className="row">
                {animations.map(({ name, description }, index) => (
                  <AnimationBadge
                    index={index}
                    name={name}
                    description={description}
                    handleDeleteAnimationClick={handleDeleteAnimationClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Animations;
