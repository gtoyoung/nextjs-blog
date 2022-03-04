import React from "react";
import "./style.css";

export const Toggle = ({ isChecked, handleToggle }) => {
  return (
    <div className="switch">
      <input
        type="checkbox"
        className={`switch-checkbox`}
        checked={isChecked}
        onChange={handleToggle}
        id={`switch-input`} // label의 htmlFor에 걸어줄 id
      />
      <label
        className={`switch-label`}
        htmlFor={`switch-input`} // input id를 걸어준다
      >
        <div className="ball" />
      </label>
    </div>
  );
};
