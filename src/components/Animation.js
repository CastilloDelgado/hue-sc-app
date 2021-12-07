import React, { useState } from "react";
import HueService from "../services/Hue";

const Animation = () => {
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState("");
  const [sleepTime, setSleepTime] = useState(1000);
  const [on, setOn] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  console.log(on);

  const handleMessageChange = (e) => setMessage(e.target.value);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const changeState = (id, body) => {
    HueService.setLightState(id, body);
  };

  const executeAnimation = async () => {
    for (let i = 0; i < 10; i++) {
      for (const { message, light1, light2, light3, light4 } of steps) {
        console.log(message);
        changeState(1, {
          on: light1,
          bri: 254,
          transitiontime: 2,
        });
        changeState(2, {
          on: light2,
          bri: 254,
          transitiontime: 2,
        });
        changeState(3, {
          on: light3,
          bri: 254,
          transitiontime: 2,
        });
        changeState(4, {
          on: light4,
          bri: 254,
          transitiontime: 2,
        });
        await sleep(sleepTime);
      }
    }
  };

  const handleSleepTimeChange = (e) => setSleepTime(e.target.value);

  const addStep = (e) => {
    setSteps([
      ...steps,
      {
        message: message,
        light1: on[1],
        light2: on[2],
        light3: on[3],
        light4: on[4],
      },
    ]);
    setMessage("");
  };

  const deleteStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleOnChange = (e, id) => {
    setOn({
      ...on,
      [id]: e.target.checked,
    });
  };

  return (
    <div>
      <h3>Create An Animation</h3>
      <button
        type="button"
        className="btn btn-primary"
        onClick={executeAnimation}
      >
        Execute Animation
      </button>
      <input
        type="text"
        className="form-control"
        value={sleepTime}
        onChange={handleSleepTimeChange}
      />
      <form className="mt-3">
        <div className="row align-items-center">
          <div className="col-auto">
            <label htmlFor="message" className="col-form-label">
              Message:
            </label>
          </div>
          <div className="col-auto">
            <input
              type="text"
              className="form-control"
              placeholder="Add a message"
              onChange={handleMessageChange}
              value={message}
            />
          </div>
          <div className="col-auto">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                onChange={(e) => handleOnChange(e, 1)}
                checked={on[1]}
              />
              <label htmlFor="on" className="form-check-label">
                Light 1 State
              </label>
            </div>
          </div>
          <div className="col-auto">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                onChange={(e) => handleOnChange(e, 2)}
                checked={on[2]}
              />
              <label htmlFor="on" className="form-check-label">
                Light 2 State
              </label>
            </div>
          </div>
          <div className="col-auto">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                onChange={(e) => handleOnChange(e, 3)}
                checked={on[3]}
              />
              <label htmlFor="on" className="form-check-label">
                Light 3 State
              </label>
            </div>
          </div>
          <div className="col-auto">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                onChange={(e) => handleOnChange(e, 4)}
                checked={on[4]}
              />
              <label htmlFor="on" className="form-check-label">
                Light 3 State
              </label>
            </div>
          </div>

          <div className="col-auto">
            <button type="button" className="btn btn-primary" onClick={addStep}>
              Add Step
            </button>
          </div>
        </div>
      </form>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Step</th>
            <th scope="col">Message</th>
            <th scope="col">Light 1</th>
            <th scope="col">Light 2</th>
            <th scope="col">Light 3</th>
            <th scope="col">Light 4</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {steps.map(({ message, light1, light2, light3, light4 }, index) => (
            <tr key={index}>
              <th>{index}</th>
              <td>{message}</td>
              <td>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    disabled
                    checked={light1}
                  />
                </div>
              </td>
              <td>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    disabled
                    checked={light2}
                  />
                </div>
              </td>
              <td>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    disabled
                    checked={light3}
                  />
                </div>
              </td>
              <td>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    disabled
                    checked={light4}
                  />
                </div>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => deleteStep(index)}
                >
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Animation;
