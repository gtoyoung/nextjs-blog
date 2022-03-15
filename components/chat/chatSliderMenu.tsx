import React, { useState } from "react";
import CheeseburgerMenu from "cheeseburger-menu";
import HamburgerMenu from "react-hamburger-menu";
import ChatRoomListRenew from "./chatRoomListRenew";
import "./style.css";

const ChatSliderMenu = ({ selectedRoom, color }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <br />
      <CheeseburgerMenu isOpen={isOpen} closeCallback={() => setIsOpen(false)}>
        <ChatRoomListRenew
          selectedRoom={(room) => {
            selectedRoom(room);
            setIsOpen(false);
          }}
          closedMenu={() => {
            setIsOpen(false);
          }}
        />
      </CheeseburgerMenu>

      <HamburgerMenu
        isOpen={isOpen}
        menuClicked={() => {
          setIsOpen(!isOpen);
        }}
        width={32}
        height={24}
        strokeWidth={3}
        rotate={0}
        color={color}
        borderRadius={0}
        animationDuration={0.5}
      />
    </>
  );
};

export default ChatSliderMenu;
