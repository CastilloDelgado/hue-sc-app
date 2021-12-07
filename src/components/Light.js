import React, { useState } from "react";
import HueService from "../services/Hue";
import ColorPicker from "./ColorPicker";

const Light = ({ info }) => {
  const { name, productid, productname } = info || {};
  const [color, setColor] = useState("#ffffff");
  const [state, setState] = useState(info.state);

  const changeState = (id, body) => HueService.setLightState(id, body);

  const onColorChange = (color) => setColor(color.rgb);

  const setNewColor = (id, rgb) => {
    const result = rgbToXy(rgb);
    const { x, y, brightness } = result;

    const body = {
      on: true,
      bri: parseInt(Math.round(brightness * 255)),
      xy: [parseFloat(x), parseFloat(y)],
      transitiontime: 0,
    };

    changeState(id, body);
  };

  const changeBrightness = (event) => {
    setState({
      ...state,
      bri: event.target.value,
    });

    HueService.setLightState(info.id, {
      bri: parseInt(event.target.value),
      transitiontime: 0,
    })
      .then(() => {
        console.log(event.target.value, state);
      })
      .catch((error) => console.log(error));
  };

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
      brightness: brightness,
    };
  };

  return (
    <div className="col">
      <p>{`Name: ${name}`}</p>
      <p>{`Product ID: ${productid}`}</p>
      <p>{`Product Name: ${productname}`}</p>
      <label htmlFor="brightness" className="form-label">
        Brightness
      </label>
      <input
        type="range"
        className="form-range"
        id="brightness"
        min="0"
        max="254"
        step="10"
        onChange={changeBrightness}
        value={state.bri}
      />
      <input
        type="color"
        onChange={(e) => {
          console.log(e, e.target.value);
        }}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() =>
          changeState(info.id, {
            on: true,
            bri: 254,
            transitiontime: 0,
          })
        }
      >
        On
      </button>
      <button
        type="button"
        className="btn btn-danger ms-2"
        onClick={changeState(info.id, {
          on: false,
          transitiontime: 0,
        })}
      >
        Off
      </button>
      <button
        type="button"
        className="btn btn-success ms-2"
        onClick={() => {
          changeState(info.id, {
            on: !state.on,
            bri: 254,
            transitiontime: 0,
          });
          setState({
            ...state,
            on: !state.on,
          });
        }}
      >
        Change State
      </button>
      {/* COLOR PICKER */}
      <div>
        <ColorPicker color={color} onColorChange={onColorChange} />
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setNewColor(info.id, color)}
      >
        Set Color
      </button>
    </div>
  );
};

export default Light;
