import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Droppable, DragDropContext, DropResult } from "react-beautiful-dnd";
import { Layout } from "components/layout";
import Column from "../../components/task/column";
import { IData } from "type/task.types";
import FbDatabase from "services/firebase/database";
import { useAuth } from "services/authprovider";
import { onValue } from "firebase/database";
import toast from "../../components/util/toast";

const Container = styled.div`
  display: flex;
  @media screen and (max-width: 900px) {
    width: 100%;
    flex-direction: column;
  }
`;

const TaskPage = () => {
  const { user } = useAuth();
  const db = new FbDatabase(false);

  const [data, setData] = useState<IData>();
  const [width, setWidth] = useState(0);

  const notify = useCallback((type, message) => {
    toast({ type, message });
  }, []);

  useEffect(() => {
    if (user) {
      db.getTaskAllData(user.uid).then((result) => {
        if (result) setData(result);
        else {
          setData({
            columns: {},
            tasks: {},
            columnOrder: [],
          });
        }
      });

      var taskDataRef = db.getRef("/users/" + user.uid + "/taskData");
      onValue(taskDataRef, () => {
        db.getTaskAllData(user.uid).then((result) => {
          if (result) setData(result);
          else {
            setData({
              columns: {},
              tasks: {},
              columnOrder: [],
            });
          }
        });
      });
    } else {
      setData({
        columns: {},
        tasks: {},
        columnOrder: [],
      });
    }
    setWidth(window.innerWidth);

    // 반응형 크기에 따라 drag의 방향을 수정하기 위한 처리
    window.addEventListener("resize", () => {
      if (width > 1330 && window.innerWidth < 1330) {
        setWidth(window.innerWidth);
      } else if (width < 1330 && window.innerWidth > 1330) {
        setWidth(window.innerWidth);
      }
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, [user, width]);

  const createTask = (targetColumn) => {
    if (Object.keys(data.tasks).length > 0) {
      const taskIdList = Object.keys(data.tasks)
        .map((key) => {
          return parseInt(key.split("-")[1]);
        })
        .filter((key) => {
          return key;
        });
      const maxNumber = Math.max(...taskIdList);
      const newTask = {
        id: `task-${maxNumber + 1}`,
        content: `태스크 ${maxNumber + 1}`,
        alertDate: null,
      };

      const newTasks = {
        [newTask.id]: newTask,
      };

      const newColumns = {
        ...data.columns[targetColumn],
        taskIds: [...data.columns[targetColumn].taskIds, newTask.id],
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [targetColumn]: newColumns,
        },
        tasks: {
          ...data.tasks,
          ...newTasks,
        },
      };

      // db 삽입
      db.updateTaskData(user.uid, newData).then(() => {
        setData(newData);
      });
    } else {
      const newTask = {
        id: `task-1`,
        content: "태스크 1",
        alertDate: null,
      };

      const newTasks = {
        [newTask.id]: newTask,
      };

      const newColumns = {
        ...data.columns[targetColumn],
        taskIds: [...data.columns[targetColumn].taskIds, newTask.id],
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [targetColumn]: newColumns,
        },
        tasks: {
          ...data.tasks,
          ...newTasks,
        },
      };

      db.updateTaskData(user.uid, newData).then(() => {
        setData(newData);
      });
    }
  };

  const createColumn = () => {
    if (Object.keys(data.columns).length > 0) {
      const dataCnt = Object.keys(data.columns).length;
      if (dataCnt == 5) {
        notify("warning", "컬럼은 최대 5개까지 생성할 수 있습니다.");
        return;
      }
      const maxNumber = Math.max(
        ...data.columnOrder
          .map((column) => {
            return parseInt(column.split("-")[1]);
          })
          .filter((column) => {
            return column;
          })
      );
      const newColumn = {
        id: `column-${maxNumber + 1}`,
        title: `컬럼 ${maxNumber + 1}`,
        type: "",
        taskIds: [],
      };

      const newColumns = {
        ...data.columns,
        [newColumn.id]: newColumn,
      };

      const newData = {
        ...data,
        columnOrder: [...data.columnOrder, newColumn.id],
        columns: newColumns,
      };

      // db 삽입
      db.updateTaskData(user.uid, newData).then(() => {
        setData(newData);
      });
    } else {
      const newColumn = {
        id: "column-1",
        title: "컬럼 1",
        type: "",
        taskIds: [],
      };

      const newColumns = {
        [newColumn.id]: newColumn,
      };
      const newData = {
        tasks: {},
        columns: newColumns,
        columnOrder: ["column-1"],
      };

      db.updateTaskData(user.uid, newData).then(() => {
        setData(newData);
      });
    }
  };

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId, type } = result;
      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        source.index === destination.index
      )
        return;

      if (type === "column") {
        const newColumnOrder = Array.from(data.columnOrder);
        newColumnOrder.splice(source.index, 1);
        newColumnOrder.splice(destination.index, 0, draggableId);

        const newData = {
          ...data,
          columnOrder: newColumnOrder,
        };

        db.updateColumnIndex(user.uid, newColumnOrder).then(() => {
          setData(newData);
        });
        return;
      }
      const startColumn = data.columns[source.droppableId];
      const finishColumn = data.columns[destination.droppableId];

      if (startColumn === finishColumn) {
        const newTaskIds = Array.from(startColumn.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...startColumn,
          taskIds: newTaskIds,
        };

        const newData = {
          ...data,
          columns: {
            ...data.columns,
            [newColumn.id]: newColumn,
          },
        };

        //같은 컬럼 데이터에서 index 변경
        db.updateTaskIndex(
          user.uid,
          startColumn.id,
          finishColumn.id,
          newColumn.taskIds,
          null
        ).then(() => {
          setData(newData);
        });
      } else {
        const startTaskIds = Array.from(startColumn.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStartColumn = {
          ...startColumn,
          taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finishColumn.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinishColumn = {
          ...finishColumn,
          taskIds: finishTaskIds,
        };

        const newData = {
          ...data,
          columns: {
            ...data.columns,
            [newStartColumn.id]: newStartColumn,
            [newFinishColumn.id]: newFinishColumn,
          },
        };

        db.updateTaskIndex(
          user.uid,
          startColumn.id,
          finishColumn.id,
          newStartColumn.taskIds,
          newFinishColumn.taskIds
        ).then(() => {
          setData(newData);
        });
      }
    },
    [data]
  );

  const deleteColumn = (columnId: string) => {
    const taskList = data.columns[columnId].taskIds;
    const newColumnOrder = data.columnOrder.filter(
      (id) => id !== columnId
    ) as string[];

    // task 필터링
    if (data.tasks) {
      for (const [key, _value] of Object.entries<any>(data.tasks)) {
        if (taskList.includes(key)) {
          delete data.tasks[key];
        }
      }
    }

    // column 필터링
    for (const [key, _value] of Object.entries<any>(data.columns)) {
      if (key === columnId) {
        delete data.columns[key];
      }
    }

    const newDatas: IData = {
      tasks: {
        ...data.tasks,
      },
      columns: {
        ...data.columns,
      },
      columnOrder: newColumnOrder,
    };

    db.updateTaskData(user.uid, newDatas)
      .then(() => {
        setData(newDatas);
        notify("success", "컬럼이 삭제되었습니다.");
      })
      .catch(() => {
        notify("error", "컬럼 삭제에 실패했습니다.");
      })
      .finally(() => {
        document.getElementById("trash-zone").style.display = "none";
      });
  };

  const deleteTask = (columnId: string, taskId: string) => {
    // 컬럼에서 데이터 제거
    const newColumn = {
      ...data.columns[columnId],
      taskIds: data.columns[columnId].taskIds.filter((id) => id !== taskId),
    };

    // task 제거
    delete data.tasks[taskId];

    const newData: IData = {
      ...data,
      columns: {
        ...data.columns,
        [newColumn.id]: newColumn,
      },
    };

    db.updateTaskData(user.uid, newData)
      .then(() => {
        setData(newData);
        notify("success", "일정이 삭제되었습니다.");
      })
      .catch(() => {
        notify("error", "일정 삭제에 실패했습니다.");
      })
      .finally(() => {
        document.getElementById("trash-zone").style.display = "none";
      });
  };

  return (
    <Layout isMax={true}>
      <h3>Task를 생성해보세요</h3>
      {/* <ContextMenu createTask={createTask} createColumn={createColumn} /> */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          type="column"
          direction={width >= 1330 ? "horizontal" : "vertical"}
          style={{ alignItems: "center" }}
        >
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {data ? (
                data.columnOrder.map((columnId, index) => {
                  const column = data.columns[columnId];
                  const tasks = column.taskIds.map(
                    (taskId) => data.tasks[taskId]
                  );
                  return (
                    <>
                      <Column
                        key={columnId}
                        column={column}
                        tasks={tasks}
                        index={index}
                        addTask={createTask}
                        deleteColumn={deleteColumn}
                        deleteTask={deleteTask}
                      />
                    </>
                  );
                })
              ) : (
                <>Task Loading...</>
              )}
              <div
                id="columnAddBtn"
                style={{
                  margin: "8px",
                  width: "33%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <a
                  href={"javascript:void(0);"}
                  onClick={createColumn}
                  style={{
                    margin: "auto",
                    display: "block",
                    backgroundImage: "none !important",
                  }}
                >
                  <img
                    src={"/img/plus.png"}
                    style={{
                      border: "transparent",
                      width: "40%",
                    }}
                  />
                </a>
              </div>
              <div
                style={{
                  position: "fixed",
                  backgroundImage: "url(/img/bin.png)",
                  backgroundSize: "cover",
                  top: "50%",
                  left: "50%",
                  marginTop: "-50px",
                  marginLeft: "-50px",
                  width: 150,
                  height: 150,
                  display: "none",
                }}
                id="trash-zone"
                onDragEnter={(e) => {
                  e.preventDefault();
                  return false;
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  document.getElementById("trash-zone").style.backgroundImage =
                    "url(/img/recycle-bin.png)";
                }}
                onDragLeave={() => {
                  document.getElementById("trash-zone").style.backgroundImage =
                    "url(/img/bin.png)";
                  return false;
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const columnId = e.dataTransfer.getData("columnId");
                  const taskId = e.dataTransfer.getData("taskId");
                  if (columnId && taskId) {
                    deleteTask(columnId, taskId);
                  } else if (columnId) {
                    deleteColumn(columnId);
                  } else {
                  }

                  return false;
                }}
              ></div>
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </Layout>
  );
};

export default TaskPage;
