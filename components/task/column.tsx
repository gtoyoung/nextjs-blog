import React from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { BsFillXCircleFill } from "react-icons/bs";
import { FcDeleteDatabase } from "react-icons/fc";
import { isMobile } from "react-device-detect";
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
  position: relative;
  flex-direction: column;
  @media screen and (max-width: 900px) {
    width: 98%;
  }
`;

const Title = styled.h5`
  padding: 13px;
  text-align: center;
  margin-top: 0px;
  position: absolute;
  float: left;
  z-index: 999;
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

const DelButton = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  padding: 9px;
  background-image: none;
  cursor: pointer;
`;

const ColDelutton = styled.a`
  position: absolute;
  top: 0;
  right: 0px;
  padding: 16px;
  background-image: none;
  cursor: pointer;
`;

const Column = (props: IColumnProps) => {
  const { column, index, tasks, addTask, deleteColumn, deleteTask } = props;

  return (
    <>
      <Draggable draggableId={column.id} index={index}>
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.draggableProps}>
            <MoveDiv {...provided.dragHandleProps} id={"columnMove"}></MoveDiv>
            <Title>{column.title}</Title>
            <ColDelutton
              onTouchStart={(e) => {
                e.preventDefault();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                if (confirm("Are you sure you want to delete this column?")) {
                  deleteColumn(column.id);
                }
              }}
              onDragStart={(e) => {
                if (!isMobile) {
                  e.dataTransfer.setData("columnId", column.id);
                  document.getElementById("trash-zone").style.display = "block";
                }
              }}
              onDragEnd={(e) => {
                if (!isMobile) {
                  e.preventDefault();
                  document.getElementById("trash-zone").style.display = "none";
                }
              }}
              draggable={true}
              style={{ cursor: "grabbing" }}
            >
              <FcDeleteDatabase />
            </ColDelutton>
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
                        <div style={{ position: "relative" }}>
                          <Task key={task.id} task={task} index={idx} />
                          <DelButton
                            onTouchStart={(e) => {
                              e.preventDefault();
                            }}
                            onTouchEnd={(e) => {
                              e.preventDefault();
                              if (
                                confirm(
                                  "Are you sure you want to delete this task?"
                                )
                              ) {
                                deleteTask(column.id, task.id);
                              }
                            }}
                            onDragStart={(e) => {
                              if (!isMobile) {
                                e.dataTransfer.setData("columnId", column.id);
                                e.dataTransfer.setData("taskId", task.id);
                                document.getElementById(
                                  "trash-zone"
                                ).style.display = "block";
                              }
                            }}
                            onDragEnd={(e) => {
                              if (!isMobile) {
                                e.preventDefault();
                                document.getElementById(
                                  "trash-zone"
                                ).style.display = "none";
                              }
                            }}
                            draggable={"true"}
                          >
                            <BsFillXCircleFill />
                          </DelButton>
                        </div>
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
            <button
              style={{
                backgroundColor: "ghostwhite",
                border: "transparent",
                borderRadius: "0px",
                width: "100%",
              }}
              onClick={() => addTask(column.id)}
            >
              Add Task
            </button>
          </Container>
        )}
      </Draggable>
    </>
  );
};

export default Column;
