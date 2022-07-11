export type IData = {
  tasks: {
    [key: string]: { id: string; content: string; index: number };
  };
  columns: {
    [key: string]: { id: string; title: string; taskIds: string[] };
  };
  columnOrder: string[];
};

export type IColumnProps = {
  column: { id: string; title: string; taskIds: string[] };
  tasks: {
    id: string;
    content: string;
    index: number;
  }[];
  index: number;
};

export type ITaskProps = {
  task: {
    id: string;
    content: string;
  };
  index: number;
};

export type ISetDataProps = {
  setData: React.Dispatch<React.SetStateAction<IData>>;
  data: IData;
};
