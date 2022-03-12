import React, { Fragment, useState } from "react";
import { css } from "@emotion/css";

const easeSlow = css`
  transition: all 450ms ease-in-out;
`;

const menuBtn = css`
  position: absolute;
  z-index: 3;
  right: 35px;
  top: 35px;
  cursor: pointer;
  ${easeSlow};
  &.closer {
    transform: rotate(180deg);
  }
`;

const btnLine = css`
  width: 28px;
  height: 4px;
  margin: 0 0 5px 0;
  background-color: #71c57f;
  ${easeSlow};
  &.closer {
    background-color: #e76e81;
    &:nth-child(1) {
      transform: rotate(45deg) translate(4px, 0px);
      width: 20px;
    }
    &:nth-child(2) {
      transform: translateX(-8px);
    }
    &:nth-child(3) {
      transform: rotate(-45deg) translate(4px, 0px);
      width: 20px;
    }
  }
`;

const menuOverlay = css`
  z-index: 2;
  position: fixed;
  top: 0;
  right: 0;
  background-color: white;
  height: 100vh;
  width: 40vw;
  transform: translateX(100%);
  transition: all 500ms ease-in-out;
  &.show {
    background-color: #fef7e1;
    transform: translateX(0%);
  }
  nav {
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    a {
      height: 30px;
      text-decoration: none;
      color: #eb4c54;
      cursor: pointer;
      transition: all 150ms ease-in-out;
      &:hover {
        color: #f28eba;
      }
    }
  }
  @media (max-width: 800px) {
    width: 100vw;
  }
`;

const SlideMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Fragment>
      <div
        className={`${menuBtn} ${isMenuOpen ? "closer" : null}`}
        onClick={toggleMenu}
      >
        <div className={`${btnLine} ${isMenuOpen ? "closer" : null}`} />
        <div className={`${btnLine} ${isMenuOpen ? "closer" : null}`} />
        <div className={`${btnLine} ${isMenuOpen ? "closer" : null}`} />
      </div>
      <div className={`${menuOverlay} ${isMenuOpen ? "show" : null}`}>
        <nav>
          <a href="#">Cool thing to click</a>
          <a href="#">An even cooler thing to click</a>
          <a href="#">Some more stuff to click</a>
        </nav>
      </div>
    </Fragment>
  );
};

export default SlideMenu;
