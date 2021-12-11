import React from "react";
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
`;

const Column = ({ key, column, tasks }) => (
  <Container>
    <Title>{column.title}</Title>
    <Droppable droppableId={column.id}>
      {({ droppableProps, innerRef, placeholder }) => (
        <TaskList innerRef={innerRef} {...droppableProps}>
          {tasks.map((task, index) => (
            <Task key={task.id} task={task} index={index} />
          ))}
          {placeholder}
        </TaskList>
      )}
    </Droppable>
  </Container>
);

export default Column;
