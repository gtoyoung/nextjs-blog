import React from "react";
import styled from "@emotion/styled";
import { Draggable } from "react-beautiful-dnd";
import { ITaskProps } from "type/task.types";

type IContainer = {
  isDragging: boolean;
  isDragDisabled: boolean;
};

const Container = styled.div<IContainer>`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) =>
    props.isDragDisabled
      ? "lightgrey"
      : props.isDragging
      ? "lightgreen"
      : "white"};
  display: flex;
  position: relative;
  gap: 8px;
`;

const Task = ({ task, index }: ITaskProps) => {
  // const isDragDisabled = task.id === "task-1";
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {task.content}
        </Container>
      )}
    </Draggable>
  );
};

export default React.memo(Task);
