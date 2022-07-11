import React from "react";
import { spring, Motion } from "react-motion";

import { useContextMenu } from "./usecontextmenu";

const ContextMenu = ({ createTask, createColumn }: { createTask: any, createColumn: any }): JSX.Element => {
  const { xPos, yPos, showMenu, targetColumn, type } = useContextMenu();

  return (
    <>
      <Motion
        defaultStyle={{ opacity: 0 }}
        style={{ opacity: !showMenu ? spring(0) : spring(1) }}
      >
        {(interpolatedStyle) => (
          <>
            {showMenu ? (
              <div
                className="menu-container"
                style={{
                  top: yPos,
                  left: xPos,
                  opacity: interpolatedStyle.opacity,
                  zIndex: 100,
                  border: "1px solid gray",
                  borderTopLeftRadius: "5px",
                  borderTopRightRadius: "5px",
                  borderBottomLeftRadius: "5px",
                  borderBottomRightRadius: "5px",
                  position: "absolute",
                }}
              >
                {type === "dnd" ? (
                  <button
                    onClick={() => {
                      if (showMenu) {
                        createTask(targetColumn);
                      }
                    }}
                  >
                    Task 생성
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (showMenu) {
                        createColumn();
                      }
                    }}
                  >
                    Fense 생성
                  </button>
                )}
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </Motion>
    </>
  );
};

export default ContextMenu;
