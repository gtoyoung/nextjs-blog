import React from "react";
import "./style.css";

export const Board = ({
  title,
  content,
  clickPost,
  status,
}: {
  title: string;
  content: string;
  clickPost: any;
  status: string;
}) => {
  return (
    <>
      <div className="card postMain" onClick={clickPost}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="card-body postCard">
            <h5 className="card-title">{title}</h5>
            <p className="card-text postContent">{content}</p>
          </div>
        </div>
        {status === "complete" && (
          <img
            src="./img/monophy.gif"
            style={{ width: "60px", height: "60px", position: "absolute" }}
          />
        )}
      </div>
      <br />
    </>
  );
};
