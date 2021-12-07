import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Light from "./Light";
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
            result.map((light) => ({
              id: light[0],
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
        className={`container-fluid mt-3 ${darkMode && "bg-dark text-white"}`}
        style={{ minHeight: "95vh" }}
      >
        <div className="row justify-content-center">
          <div className="col col-lg-6">
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
                    {lights.map((light) => (
                      <div className="col-12 col-md-6">
                        <Light light={light} />
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
