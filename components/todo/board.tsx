import React from "react";
import "./style.css";

export const Board = ({ title, content, clickPost }) => {
  return (
    <>
      <div className="card postMain" onClick={clickPost}>
        <div className="card-body postCard">
          <h5 className="card-title">{title}</h5>
          <p className="card-text postContent">{content}</p>
        </div>
      </div>
      <br />
    </>
  );
};
