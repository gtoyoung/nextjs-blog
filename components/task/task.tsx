import React, { useState } from "react";
import styled from "@emotion/styled";
import { Draggable } from "react-beautiful-dnd";
import { ITaskProps } from "type/task.types";
import FbDatabase from "services/firebase/database";
import { useAuth } from "services/authprovider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdScheduleSend } from "react-icons/md";

type IContainer = {
  isDragging: boolean;
  isDragDisabled: boolean;
};

const Container = styled.div<IContainer>`
  border: 1px solid lightgrey;
  border-radius: 50px;
  padding: 16px;
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
  width: 100%;
`;

const Task = ({ task, index, parentType }: ITaskProps) => {
  const db = new FbDatabase(false);
  const isDragDisabled = parentType === "DONE";
  const { user } = useAuth();

  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState(task.content);
  const [date, setDate] = useState(
    new Date(task.alertDate ? task.alertDate : new Date())
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    setIsOpen(!isOpen);
    updateTaskDate(e);
  };
  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const updateTaskContent = () => {
    if (content === task.content) {
      setEdit(false);
    } else {
      db.updateTask(user.uid, task.id, content).then(() => {
        setEdit(false);
      });
    }
  };

  const updateTaskDate = (selectedDate) => {
    if (selectedDate === task.alertDate) {
      return;
    } else {
      db.updateTaskAlertDate(user.uid, task.id, selectedDate).then(() => {
        setDate(selectedDate);
      });
    }
  };

  return (
    <Draggable
      draggableId={task.id}
      index={index}
      // isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          isDragDisabled={isDragDisabled}
        >
          {edit ? (
            <textarea
              id="task-content"
              value={content}
              style={{ width: "80%" }}
              autoFocus
              onChange={(e) => {
                setContent(e.target.value);
              }}
              onBlur={() => {
                updateTaskContent();
              }}
            />
          ) : (
            <div>
              <span
                style={{ padding: "5px" }}
                onDoubleClick={() => {
                  setEdit(true);
                }}
              >
                {task.content}
              </span>
              <p>
                {task.alertDate &&
                  `Alert date :${new Date(
                    date
                  ).toLocaleDateString()} ${new Date(
                    date
                  ).toLocaleTimeString()}`}
              </p>
              <MdScheduleSend
                onClick={handleClick}
                size={30}
                style={{ position: "absolute", right: 0, bottom: 0 }}
              />
              {isOpen && (
                <DatePicker
                  selected={date}
                  onChange={handleChange}
                  timeInputLabel="Time:"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  showTimeInput
                  inline
                />
              )}
            </div>
          )}
        </Container>
      )}
    </Draggable>
  );
};

export default React.memo(Task);
