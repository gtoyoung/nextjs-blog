export type IData = {
  tasks: {
    [key: string]: { id: string; content: string; alertDate: Date };
  };
  columns: {
    [key: string]: {
      id: string;
      title: string;
      type: string;
      taskIds: string[];
    };
  };
  columnOrder: string[];
};

export type IColumnProps = {
  column: { id: string; title: string; type: string; taskIds: string[] };
  tasks: {
    id: string;
    content: string;
    alertDate: Date;
  }[];
  index: number;
  addTask: (columnId: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  deleteColumn: (columnId: string) => void;
};

export type ITaskProps = {
  task: {
    id: string;
    content: string;
    alertDate: Date;
  };
  index: number;
  parentType: string;
};

export type ISetDataProps = {
  setData: React.Dispatch<React.SetStateAction<IData>>;
  data: IData;
};

export const ColumnType = [
  { value: "TODO", label: "To Do" },
  { value: "INPROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];
