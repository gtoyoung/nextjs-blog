import { useCallback, useEffect, useState } from "react";
import { isBrowser, isMobile } from "react-device-detect";

export const useContextMenu = () => {
  const [xPos, setXPos] = useState("0px");
  const [yPos, setYPos] = useState("0px");
  const [showMenu, setShowMenu] = useState(false);
  const [targetColumn, setTargetColumn] = useState(null);
  const [type, setType] = useState("dnd");

  const handleContextMenu = useCallback(
    (e) => {
      if (
        e.target.id === "columnTitle" ||
        e.target.id === "columnMove" ||
        e.target.id === "dropCaption"
      ) {
        e.preventDefault();
        setShowMenu(false);
        return;
      }
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

  let timer;
  const touchDuration = 500;

  const touchStart = useCallback(
    (e) => {
      timer = setTimeout(() => {
        showMenu && setShowMenu(false);
        handleContextMenu(e);
      }, touchDuration);
    },
    [showMenu]
  );

  const touchEnd = useCallback(() => {
    if (timer) clearTimeout(timer);
  }, [showMenu]);

  useEffect(() => {
    if (isBrowser) {
      document.addEventListener("click", handleClick);
      document.addEventListener("contextmenu", handleContextMenu);
    } else if (isMobile) {
      document.addEventListener("touchstart", touchStart);
      document.addEventListener("touchend", touchEnd);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("touchstart", touchStart);
      document.removeEventListener("touchend", touchEnd);
    };
  });

  return { xPos, yPos, showMenu, targetColumn, type };
};
