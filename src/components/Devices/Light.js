import React from "react";
import ColorPicker from "../ColorPicker";
import { useApp } from "../../contexts/AppContext";

const Light = ({ light }) => {
  const { darkMode } = useApp();

  return (
    <>
      <div className="container-fluid border border-1 border-secondary rounded-3 mb-3 py-3">
        <div className="row">
          <div className="col-12">
            <div className="row justify-content-between">
              <div className="col">{light.name}</div>

              <div className="col-1 d-flex justify-content-end">
                <div class="form-check form-switch me-3">
                  <label class="form-check-label" for="flexSwitchCheckDefault">
                    (On)
                  </label>
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                  />
                </div>
                <div>
                  <i
                    class="bi bi-pen"
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
          <div className="col-12 justify-content-center mt-3">
            <div className="container-fluid justify-content-center px-auto d-flex">
              <ColorPicker className="d-flex" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Light;
