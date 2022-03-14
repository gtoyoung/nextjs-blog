import { createContext } from "react";
import socketIo from "socket.io-client";

export const SOCKET_EVENT = {
  JOIN_ROOM: "JOIN_ROOM",
  SEND_MESSAGE: "SEND_MESSAGE",
  RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
  LEAVE_ROOM: "LEAVE_ROOM",
};

export const socket = socketIo(String(process.env.NEXT_PUBLIC_SOKET_URL), {
  withCredentials: true,
  transports: ["websocket"],
});
export const SocketContext = createContext(socket);

socket.on("connect", () => {
  console.log("connected to socket");
});

socket.on("disconnect", () => {
  console.log("disconnected from socket");
});

export const makeMessage = (pongData) => {
  const { nickName, content, type, time, roomId } = pongData;

  let nickNameLabel;
  let contentLabel;
  let roomIdLabel;
  let typeLabel;
  switch (type) {
    case SOCKET_EVENT.JOIN_ROOM: {
      contentLabel = `${nickName}님이 방에 참가했습니다.`;
      nickNameLabel = nickName;
      roomIdLabel = roomId;
      typeLabel = type;
      break;
    }
    case SOCKET_EVENT.SEND_MESSAGE: {
      contentLabel = String(content);
      nickNameLabel = nickName;
      roomIdLabel = roomId;
      typeLabel = type;
      break;
    }
    case SOCKET_EVENT.LEAVE_ROOM: {
      nickNameLabel = nickName;
      contentLabel = `${nickName}님이 방에서 나갔습니다.`;
      roomIdLabel = roomId;
      typeLabel = type;
      break;
    }
    default:
  }

  return {
    type: typeLabel,
    roomId: roomIdLabel,
    nickName: nickNameLabel,
    content: contentLabel,
    time: time,
  };
};
