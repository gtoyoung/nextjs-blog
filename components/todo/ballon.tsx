import React, { useEffect, useState } from "react";

export const Balloon = ({ position, title, clickPost }) => {
  const [left, setLeft] = useState(0);
  const [delay, setDelay] = useState(0);
  const [color, setColor] = useState("#fff");

  useEffect(() => {
    if (position % 3 === 0) {
      setLeft(Math.floor(Math.random() * 26));
    } else if (position % 3 === 1) {
      setLeft(Math.floor(26 + Math.random() * 26));
    } else {
      setLeft(Math.floor(52 + Math.random() * 28));
    }

    setDelay(Math.floor(Math.random() * 50));
    setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  }, []);

  return (
    <>
      <a
        className="balloon"
        style={{
          left: `${left}%`,
          background: `radial-gradient(circle at 100px 100px, ${color}, #000)`,
          WebkitAnimationDelay: `${delay - 10}s`,
          WebkitAnimationDuration: `${delay - 30}s`,
        }}
        href="#javascript"
        onClick={clickPost}
      >
        {title}
      </a>
      {/* <div
        style={{
          left: `${left}%`,
          WebkitAnimationDelay: `${delay}s`,
          WebkitAnimationDuration: `${delay - 30}s`,
        }}
        className="stick"
      ></div> */}
    </>
  );
};
