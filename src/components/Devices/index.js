import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import LightEditor from "./LightEditor";
import { useApp } from "../../contexts/AppContext";
import { Link } from "react-router-dom";
import HueService from "../../services/Hue";

const Devices = () => {
  const [lights, setLights] = useState([]);
  const { darkMode, networkInfo } = useApp();

  const missingNetworkInfo = (info) =>
    Object.values(info).some((element) => element === "");

  useEffect(() => {
    if (!missingNetworkInfo(networkInfo)) {
      const { ip, user } = networkInfo;
      HueService.getLights(ip, user)
        .then(({ data }) => {
          const result = Object.entries(data);
          setLights(
            result.map((light, index) => ({
              id: light[0],
              index: index,
              ...light[1],
            }))
          );
        })
        .catch((error) => console.log(error));
    }
  }, []);

  return (
    <>
      <Navbar />
      <div
        className={`container-fluid pt-3 ${darkMode && "bg-dark text-white"}`}
        style={{ minHeight: "95vh" }}
      >
        <div className="row justify-content-center mb-2">
          <div className="col col-lg-6">
            <h1 className="text-center">Lights</h1>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col col-lg-8">
            {missingNetworkInfo(networkInfo) ? (
              <>
                <p className="text-danger text-center">
                  First you need to set up a devive here{" "}
                  <Link className={`${darkMode && "text-white"}`} to="/setup">
                    Setup
                  </Link>
                </p>
              </>
            ) : (
              <>
                <div className="container-fluid p-0">
                  <div className="row">
                    {lights.map((light, index) => (
                      <div className="col-12 col-md-6" key={index}>
                        <LightEditor
                          light={light}
                          lights={lights}
                          setLights={setLights}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Devices;
