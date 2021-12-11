import React from "react";
import { Link } from "react-router-dom";

const AnimationBadge = ({
  index,
  name,
  description,
  handleDeleteAnimationClick,
}) => (
  <div className="col-12 col-md-6">
    <div className="container-fluid border border-1 border-secondary rounded-3 mb-3 pt-3 pb-3">
      <div className="row justify-between">
        <div className="col">
          <h5>{name}</h5>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <p>{description}</p>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-2 justify-content-start">
          <Link to="editor">
            <button type="button" className="btn btn-sm btn-primary">
              <i className="bi bi-pen" />
            </button>
          </Link>
        </div>
        <div className="col-2 justify-content-start">
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteAnimationClick(index)}
          >
            <i className="bi bi-trash" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AnimationBadge;
