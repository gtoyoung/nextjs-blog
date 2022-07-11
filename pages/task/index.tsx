import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Droppable, DragDropContext, DropResult } from "react-beautiful-dnd";
import { Layout } from "components/layout";
import Column from "../../components/task/column";
import { IData } from "type/task.types";
import FbDatabase from "services/firebase/database";
import { useAuth } from "services/authprovider";
import ContextMenu from "components/util/contextmenu";

const Container = styled.div`
  display: flex;
`;

const TaskPage = () => {
  const { user } = useAuth();
  const db = new FbDatabase(false);

  const [data, setData] = useState<IData>();

  useEffect(() => {
    if (user) {
      db.getTaskAllData(user.uid).then((result) => {
        setData(result);
      });
    }
  }, [user]);

  const createTask = (targetColumn) => {
    if (data?.tasks) {
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
    if (data) {
      const newColumn = {
        id: `column-${Object.keys(data.columns).length + 1}`,
        title: `컬럼 ${Object.keys(data.columns).length + 1}`,
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

  return (
    <Layout isMax={true}>
      <h3>Task를 생성해보세요</h3>
      <ContextMenu createTask={createTask} createColumn={createColumn} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
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
                    <Column
                      key={columnId}
                      column={column}
                      tasks={tasks}
                      index={index}
                    />
                  );
                })
              ) : (
                <>Task Loading...</>
              )}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </Layout>
  );
};

export default TaskPage;
