import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  border: 1px solid lightgrey;
  padding: 8px;
  border-radius: 2px;
  margin-bottom: 8px;
`;

const Task = ({ task, index }) => (
  <Draggable draggableId={task.id} index={index}>
    {({ draggableProps, dragHandleProps, innerRef }) => (
      <Container {...draggableProps} {...dragHandleProps} innerRef={innerRef}>
        {task.content}
      </Container>
    )}
  </Draggable>
);

export default Task;
