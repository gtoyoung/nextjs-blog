import { createContext } from "react";
import socketIo from "socket.io-client";

export const SOCKET_EVENT = {
  JOIN_ROOM: "JOIN_ROOM",
  SEND_MESSAGE: "SEND_MESSAGE",
  RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
  LEAVE_ROOM: "LEAVE_ROOM",
  TYPING_MESSAGE: "TYPING_MESSAGE",
};

// 중요: 웹소켓을 위한 설정이라고 명시를 해주어야한다.
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
  const { uid, nickName, content, type, time, roomId, typing } = pongData;

  // 사용자 닉네임
  let nickNameLabel;
  // 사용자 입력 내용
  let contentLabel;
  // 채팅룸 아이디
  let roomIdLabel;
  // 소켓 타입
  let typeLabel;
  // 입력중 여부
  let typingFlag;

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
    case SOCKET_EVENT.TYPING_MESSAGE: {
      contentLabel = String(content);
      nickNameLabel = nickName;
      roomIdLabel = roomId;
      typeLabel = type;
      typingFlag = typing;
      break;
    }

    default:
  }

  return {
    uid,
    typingFlag,
    type: typeLabel,
    roomId: roomIdLabel,
    nickName: nickNameLabel,
    content: contentLabel,
    time: time,
  };
};
