import React, { useState } from "react";
import ColorPicker from "../ColorPicker";
import { useApp } from "../../contexts/AppContext";
import HueService from "../../services/Hue";

const LightEditor = ({ light, lights, setLights }) => {
  const [color, setColor] = useState("#ffffff");
  const { darkMode, networkInfo } = useApp();
  const { state } = light;

  const rgbToXy = ({ r, g, b }) => {
    // Turn 0 -> 255 to 0 -> 1
    let red = parseFloat(r / 255).toFixed(5);
    let green = parseFloat(g / 255).toFixed(5);
    let blue = parseFloat(b / 255).toFixed(5);

    // Apply gamma correction
    red =
      parseFloat(red) > 0.04045
        ? parseFloat(
            Math.pow((parseFloat(red) + 0.055) / (1.0 + 0.055), 2.4)
          ).toFixed(5)
        : parseFloat(parseFloat(red) / 12.92).toFixed(5);

    green =
      parseFloat(green) > 0.04045
        ? parseFloat(
            Math.pow((parseFloat(green) + 0.055) / (1.0 + 0.055), 2.4)
          ).toFixed(5)
        : parseFloat(parseFloat(green) / 12.92).toFixed(5);

    blue =
      parseFloat(blue) > 0.04045
        ? parseFloat(
            Math.pow((parseFloat(blue) + 0.055) / (1.0 + 0.055), 2.4)
          ).toFixed(5)
        : parseFloat(parseFloat(blue) / 12.92).toFixed(5);

    // RGB -> XY

    const X = parseFloat(
      parseFloat(red) * 0.4124 +
        parseFloat(green) * 0.3576 +
        parseFloat(blue) * 0.1805
    ).toFixed(5);

    const Y = parseFloat(
      parseFloat(red) * 0.2126 +
        parseFloat(green) * 0.7152 +
        parseFloat(blue) * 0.0722
    ).toFixed(5);

    const Z = parseFloat(
      parseFloat(red) * 0.0193 +
        parseFloat(green) * 0.1192 +
        parseFloat(blue) * 0.9505
    ).toFixed(5);

    const x = parseFloat(
      parseFloat(X) / (parseFloat(X) + parseFloat(Y) + parseFloat(Z))
    ).toFixed(5);
    const y = parseFloat(
      parseFloat(Y) / (parseFloat(X) + parseFloat(Y) + parseFloat(Z))
    ).toFixed(5);
    const brightness = Y;

    return {
      x: x,
      y: y,
      brightness: 254,
    };
  };

  const handleColorChange = ({ rgb }) => {
    setColor(rgb);
    const result = rgbToXy(rgb);
    const { x, y, brightness } = result;

    const changes = {
      on: true,
      bri: brightness,
      xy: [parseFloat(x), parseFloat(y)],
      transitiontime: 0,
    };

    HueService.setLightState(networkInfo, light.id, changes)
      .then(() => {
        const lightsUpdated = [...lights];
        lightsUpdated[light.index].state = {
          ...state,
          ...changes,
        };
        setLights(lightsUpdated);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSwitchChange = ({ target: { checked } }) => {
    const changes = {
      on: !state.on,
      bri: 254,
      transitiontime: 0,
    };

    HueService.setLightState(networkInfo, light.id, changes)
      .then(() => {
        const lightsUpdated = [...lights];
        lightsUpdated[light.index].state = {
          ...state,
          ...changes,
        };
        setLights(lightsUpdated);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="container-fluid border border-1 border-secondary rounded-3 mb-3 py-3">
        <div className="row">
          <div className="col-12">
            <div className="row justify-content-between">
              <div className="col">{light.name}</div>
              <div className="col-1 d-flex justify-content-end">
                <div className="form-check form-switch me-3">
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    {state.on ? "On" : "Off"}
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    onChange={handleSwitchChange}
                    checked={state.on}
                  />
                </div>
                <div>
                  <i
                    className="bi bi-pen"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${light.id}`}
                    aria-expanded="false"
                    aria-controls={`#collapse${light.id}`}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <small>{light.productname} </small>
              </div>
            </div>
          </div>
        </div>
        <div className="collapse" id={`collapse${light.id}`}>
          <div className="col-12 justify-content-center mt-2">
            <div className="container-fluid justify-content-center px-auto d-flex">
              <ColorPicker
                className="d-flex"
                color={color}
                onColorChange={handleColorChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LightEditor;
