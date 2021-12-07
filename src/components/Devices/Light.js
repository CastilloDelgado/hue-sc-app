import React from "react";

const Light = ({ light }) => {
  const values = Object.entries(light);
  return (
    <>
      <div className="card w-100 mb-4">
        <div className="card-body">
          <h5 className="card-title">{`Name: ${light.name}`}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{`Product: ${light.productname}`}</h6>
          <p className="card-text text-justify">
            Short description of where the light is adbd bd bdab dbdbad.
          </p>
          <button type="button" className="btn btn-primary">
            Change state
          </button>
        </div>
      </div>
    </>
  );
};

export default Light;
