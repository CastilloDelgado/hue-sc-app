import React, { useState } from "react";
import Navbar from "../Navbar";
import Column from "./Column";
import { DragDropContext } from "react-beautiful-dnd";
import { useApp } from "../../contexts/AppContext";
import initialData from "./initial-data";

const AnimationEditor = () => {
  const { darkMode } = useApp();
  const [state, setState] = useState({ ...initialData });

  const onDragEnd = (result) => {
    // TODO: reorder
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
            <h1 className="text-center">Drag and Drop Example</h1>
          </div>
        </div>
        <div className="row justify-content-center mb-2">
          <div className="col col-lg-6">
            <DragDropContext onDragEnd={onDragEnd}>
              {state.columnOrder.map((columnId) => {
                const column = state.columns[columnId];
                const tasks = column.taskIds.map(
                  (taskId) => state.tasks[taskId]
                );
                return <Column key={column.id} column={column} tasks={tasks} />;
              })}
            </DragDropContext>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimationEditor;
