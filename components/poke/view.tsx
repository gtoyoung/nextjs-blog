import React from "react";
import { PoketInfo } from "type/poke.types";

const PokeView = ({ poke, koName }: { poke: PoketInfo; koName: string }) => {
  return (
    <div className="card" style={{ background: poke.color }}>
      <div className="card-body">
        <h4 className="card-title">{koName}</h4>
        <p className="card-text">신장:{poke.height}</p>
        <p className="card-text">무게:{poke.weight}</p>
        <button>더 알아보도록 하자</button>
      </div>
      <img
        className="image-bottom"
        src={poke.img.home}
        alt="Card example image"
        style={{ alignSelf: "center" }}
      />
    </div>
  );
};

export default PokeView;
