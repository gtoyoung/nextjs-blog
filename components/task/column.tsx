import React from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { IColumnProps } from "type/task.types";
import Task from "./task";

type ITaskList = {
  isDraggingOver: boolean;
};

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 220px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  padding: 8px;
`;

const TaskList = styled.div<ITaskList>`
  padding: 8px;
  background-color: ${(props) => (props.isDraggingOver ? "skyblue" : "white")};
  flex-grow: 1;
`;

const Column = (props: IColumnProps) => {
  const { column, index, tasks } = props;
  return (
    <>
      <Draggable draggableId={column.id} index={index}>
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.draggableProps}>
            <Title {...provided.dragHandleProps}>{column.title}</Title>
            <Droppable droppableId={column.id} type="task">
              {(provided, snapshot) => (
                <TaskList
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  <>
                    {tasks.map((task, idx) => (
                      <Task key={task.id} task={task} index={idx} />
                    ))}
                    {provided.placeholder}
                  </>
                </TaskList>
              )}
            </Droppable>
          </Container>
        )}
      </Draggable>
    </>
  );
};

export default Column;
