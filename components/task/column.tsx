import React, { useState } from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { BsFillXCircleFill } from "react-icons/bs";
import { FcDeleteDatabase } from "react-icons/fc";
import Select from "react-select";
import { isMobile } from "react-device-detect";
import { IColumnProps, ColumnType } from "type/task.types";
import Task from "./task";
import FbDatabase from "services/firebase/database";
import { useAuth } from "services/authprovider";

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
  background-image: none;
  cursor: pointer;
`;

const ColDelutton = styled.a`
  position: absolute;
  top: 0;
  right: 0px;
  padding: 12px;
  background-image: none;
  cursor: pointer;
`;

const Column = (props: IColumnProps) => {
  const { column, index, tasks, addTask, deleteColumn, deleteTask } = props;
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(column.title);
  const { user } = useAuth();
  const db = new FbDatabase(false);
  const [type, setType] = useState(column.type);

  const updateColumnTitle = () => {
    if (title === column.title) {
      setEdit(false);
    } else {
      db.updateColumnTitle(user.uid, column.id, title).then(() => {
        setEdit(false);
      });
    }
  };

  const getOptionValue = (option) => option.value;

  return (
    <>
      <Draggable draggableId={column.id} index={index}>
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.draggableProps}>
            <MoveDiv {...provided.dragHandleProps} id={"columnMove"}></MoveDiv>
            {edit ? (
              <input
                id="column-title"
                autoFocus
                value={title}
                style={{ left: "0px", width: "50%", position: "absolute" }}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  updateColumnTitle();
                }}
              />
            ) : (
              <Title onDoubleClick={() => setEdit(true)}>{column.title}</Title>
            )}
            <div
              style={{
                position: "absolute",
                right: "50px",
                padding: "7px",
                width: "160px",
              }}
            >
              <Select
                getOptionValue={getOptionValue}
                options={ColumnType}
                value={
                  ColumnType[ColumnType.findIndex((x) => x.value === type)]
                }
                isSearchable={false}
                onChange={(e) => {
                  db.updateColumnType(user.uid, column.id, e.value).then(() => {
                    setType(e.value);
                  });
                }}
              />
            </div>
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
              <FcDeleteDatabase size={30} />
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
                          <Task
                            key={task.id}
                            task={task}
                            index={idx}
                            parentType={type}
                          />
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
                            <BsFillXCircleFill size={20} />
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
