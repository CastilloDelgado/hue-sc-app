import React, { useEffect, useState } from "react";
import Light from "./Light";
import Animation from "./Animation";
import HueService from "../services/Hue";

const Setup = () => {
  const [id, setId] = useState();
  const [ip, setIp] = useState();
  const [user, setUser] = useState();
  const [key, setKey] = useState();
  const [lights, setLights] = useState([]);

  const getNetworkInfo = () =>
    HueService.getNetworkInfo()
      .then(({ data }) => {
        const { id, internalipaddress } = data.pop();
        setId(id);
        setIp(internalipaddress);
      })
      .catch((error) => console.log(error));

  const generateClientKey = () => {
    HueService.generateClientKey()
      .then(({ data }) => {
        const result = data.pop();
        const { username, clientkey } = result.success;
        setUser(username);
        setKey(clientkey);
      })
      .catch((error) => console.log(error));
  };

  const getLightsInfo = () => {
    HueService.getLightsInfo()
      .then(({ data }) =>
        setLights(
          Object.entries(data).map((light) => ({
            id: light[0],
            ...light[1],
          }))
        )
      )
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getNetworkInfo();
  }, []);

  useEffect(() => {
    HueService.setNetworkInfo(id, ip, user, key);
  }, [id, ip, user, key]);

  return (
    <div>
      <h3>Setup a light</h3>
      <div>
        <p>{`IP: ${ip || ""}`}</p>
        <p>{`ID: ${id || ""}`}</p>
        <p>{`USER: ${user || ""}`}</p>
        <p>{`KEY: ${key || ""}`}</p>
      </div>
      <p>Click the button of your Hue Bridge and then click here!</p>
      <button type="button" onClick={generateClientKey}>
        Generate Client Key
      </button>
      <p>Click to get the info of the lights connected</p>
      <button type="button" onClick={getLightsInfo}>
        Get Lights Info
      </button>

      <div className="container mt-3">
        <div className="row">
          {lights.map((light, index) => (
            <Light key={index} info={light} />
          ))}
        </div>
      </div>
      <div>
        <Animation />
      </div>
    </div>
  );
};

export default Setup;
