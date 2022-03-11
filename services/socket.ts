import { createContext } from "react";
import socketIo from "socket.io-client";

export const SOCKET_EVENT = {
  JOIN_ROOM: "JOIN_ROOM",
  SEND_MESSAGE: "SEND_MESSAGE",
  RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
};

export const socket = socketIo(String(process.env.NEXT_PUBLIC_SOKET_URL), {
  withCredentials: true,
});
export const SocketContext = createContext(socket);

socket.on("connect", () => {
  console.log("connected to socket");
});

socket.on("disconnect", () => {
  console.log("disconnected from socket");
});

export const makeMessage = (pongData) => {
  const { nickName, content, type, time, roomName } = pongData;

  let nickNameLabel;
  let contentLabel;

  switch (type) {
    case SOCKET_EVENT.JOIN_ROOM: {
      contentLabel = `${nickName}님이 방에 참가했습니다.`;
      break;
    }
    case SOCKET_EVENT.SEND_MESSAGE: {
      contentLabel = String(content);
      nickNameLabel = nickName;
      break;
    }
    default:
  }

  return {
    nickName: nickNameLabel,
    content: contentLabel,
    time: time,
  };
};
