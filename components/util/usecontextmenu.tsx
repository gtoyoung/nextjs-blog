import { useCallback, useEffect, useState } from "react";

export const useContextMenu = () => {
  const [xPos, setXPos] = useState("0px");
  const [yPos, setYPos] = useState("0px");
  const [showMenu, setShowMenu] = useState(false);
  const [targetColumn, setTargetColumn] = useState(null);
  const [type, setType] = useState("dnd");

  const handleContextMenu = useCallback(
    (e) => {
      if (e.target.dataset.rbdDraggableId || e.target.dataset.rbdDroppableId) {
        e.preventDefault();
        setXPos(`${e.pageX}px`);
        setYPos(`${e.pageY}px`);
        setShowMenu(true);

        if (e.target.dataset.rbdDraggableId) {
          if (e.target.dataset.rbdDraggableId.split("-")[0] === "column") {
            setTargetColumn(e.target.dataset.rbdDraggableId);
          } else {
            setTargetColumn(e.target.parentElement.dataset.rbdDroppableId);
          }
        } else {
          if (e.target.dataset.rbdDroppableId.split("-")[0] === "column") {
            setTargetColumn(e.target.dataset.rbdDroppableId);
          } else {
            setTargetColumn(e.target.parentElement.dataset.rbdDroppableId);
          }
        }
        setType("dnd");

        if (
          e.target.dataset.rbdDroppableId === "all-columns" ||
          e.target.dataset.rbdDraggableId === "all-columns"
        ) {
          setType("outside");
        }
      } else {
        e.preventDefault();
        setXPos(`${e.pageX}px`);
        setYPos(`${e.pageY}px`);
        setShowMenu(true);
        setType("outside");
      }
    },
    [setXPos, setYPos]
  );

  const handleClick = useCallback(() => {
    showMenu && setShowMenu(false);
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return { xPos, yPos, showMenu, targetColumn, type };
};
