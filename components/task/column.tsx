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
  width: 33%;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 900px) {
    width: 98%;
  }
`;

const Title = styled.h5`
  padding: 8px;
  text-align: center;
  margin-top: 0px;
  position: absolute;
`;

const MoveDiv = styled.div`
  left: 0px;
  top: 0px;
  width: 100%;
  height: 50px;
  background-color: white;
  postion: relative;
`;

const TaskList = styled.div<ITaskList>`
  padding: 8px;
  background-color: ${(props) =>
    props.isDraggingOver ? "skyblue" : "ghostwhite"};
  flex-grow: 1;
`;

const Column = (props: IColumnProps) => {
  const { column, index, tasks } = props;
  return (
    <>
      <Draggable draggableId={column.id} index={index}>
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.draggableProps}>
            <MoveDiv {...provided.dragHandleProps} id={"columnMove"}/>
            <Title
              id={"columnTitle"}
              onDragStart={(e) => {
                e.dataTransfer.setData("columnId", column.id);
                document.getElementById("trash-zone").style.display = "block";
              }}
              onDragEnd={(e) => {
                e.preventDefault();
                document.getElementById("trash-zone").style.display = "none";
              }}
              draggable={true}
              style={{ cursor: "grabbing" }}
            >
              {column.title}
            </Title>
            <Droppable droppableId={column.id} type="task">
              {(provided, snapshot) => (
                <TaskList
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  <>
                    {tasks.length > 0 ? (
                      tasks.map((task, idx) => (
                        <Task key={task.id} task={task} index={idx} />
                      ))
                    ) : (
                      <h5
                        style={{ textAlign: "center", color: "gray" }}
                        id={"dropCaption"}
                      >
                        Drop Here
                      </h5>
                    )}
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