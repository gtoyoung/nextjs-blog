export type PoketInfo = {
  id: number;
  name: string;
  height: string;
  weight: string;
  types: {
    type: {
      name: string;
    };
  }[];
  img: {
    back: string;
    front: string;
    artwork: string;
    dream: string;
    home: string;
  };
  color: string;
};
