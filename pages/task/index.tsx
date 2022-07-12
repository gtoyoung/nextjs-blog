import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Droppable, DragDropContext, DropResult } from "react-beautiful-dnd";
import { Layout } from "components/layout";
import Column from "../../components/task/column";
import { IData } from "type/task.types";
import FbDatabase from "services/firebase/database";
import { useAuth } from "services/authprovider";
import ContextMenu from "components/util/contextmenu";
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
      if (width > 900 && window.innerWidth < 900) {
        setWidth(window.innerWidth);
      } else if (width < 900 && window.innerWidth > 900) {
        setWidth(window.innerWidth);
      }
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, [user, width]);

  const createTask = (targetColumn) => {
    if (data?.tasks) {
      data.columnOrder.filter((column) => {
        column.split("-")[1];
      });
      const newTask = {
        id: `task-${Object.keys(data.tasks).length + 1}`,
        content: `태스크 ${Object.keys(data.tasks).length + 1}`,
        index: Object.keys(data.tasks).length + 1,
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

      // 데이터 셋팅
      setData(newData);

      // db 삽입
      db.createTask(
        user.uid,
        targetColumn,
        newColumns.taskIds,
        newTask.content
      );
    } else {
      const newTask = {
        id: `task-1`,
        content: "태스크 1",
        index: 1,
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

      // 데이터 셋팅
      setData(newData);

      // db 삽입
      db.createTask(
        user.uid,
        targetColumn,
        newColumns.taskIds,
        newTask.content
      );
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
      setData(newData);

      // db 삽입
      db.createColumn(user.uid, newColumn.id, newColumn.title);
    } else {
      const newColumn = {
        id: "column-1",
        title: "컬럼 1",
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

      setData(newData);
      db.createColumn(user.uid, newColumn.id, newColumn.title);
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
        setData(newData);
        //TODO: columnOrder 업데이트
        db.updateColumnIndex(user.uid, newColumnOrder);
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

        setData(newData);

        //같은 컬럼 데이터에서 index 변경
        db.updateTaskIndex(
          user.uid,
          startColumn.id,
          finishColumn.id,
          newColumn.taskIds,
          null
        );
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

        setData(newData);

        db.updateTaskIndex(
          user.uid,
          startColumn.id,
          finishColumn.id,
          newStartColumn.taskIds,
          newFinishColumn.taskIds
        );
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

    setData(newDatas);
    db.deleteColumn(user.uid, newDatas)
      .then(() => {
        notify("success", "컬럼이 삭제되었습니다.");
      })
      .catch(() => {
        notify("error", "컬럼 삭제에 실패했습니다.");
      })
      .finally(() => {
        document.getElementById("trash-zone").style.display = "none";
      });
  };
  return (
    <Layout isMax={true}>
      <h3>Task를 생성해보세요</h3>
      <ContextMenu createTask={createTask} createColumn={createColumn} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          type="column"
          direction={width >= 900 ? "horizontal" : "vertical"}
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
                      />
                    </>
                  );
                })
              ) : (
                <>Task Loading...</>
              )}
              <div
                style={{
                  position: "fixed",
                  backgroundImage: "url(/img/bin.png)",
                  backgroundSize: "cover",
                  top: "50%",
                  left: "50%",
                  marginTop: "-50px",
                  marginLeft: "-50px",
                  width: 70,
                  height: 70,
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
                  deleteColumn(columnId);
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
