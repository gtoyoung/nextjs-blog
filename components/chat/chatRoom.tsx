import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "services/authprovider";
import { SocketContext, SOCKET_EVENT, makeMessage } from "services/socket";
import MessageForm from "./messageForm";

type ChatRoomType = {
  roomName: string;
  roomId: string;
  created: Date;
  participants: string[];
  owner: string;
};

const ChatRoom = ({ room }: { room: ChatRoomType }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([] as any[]);
  const chatWindow = useRef(null);
  const socket = useContext(SocketContext);
  const [prevRoom, setPrevRoom] = useState(null as ChatRoomType);

  const moveScrollToReceiveMessage = useCallback(() => {
    if (chatWindow.current) {
      chatWindow.current.scrollTo({
        top: chatWindow.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  const handleChangeMessage = useCallback(
    (pongData) => {
      const newMessage = makeMessage(pongData);
      // 채팅방을 떠났다는 메시지는 현재의 사용자에게서는 제외
      if (
        newMessage.type === SOCKET_EVENT.LEAVE_ROOM &&
        newMessage.nickName === user.displayName
      ) {
        return;
      } else {
        setMessages((messages) => [...messages, newMessage]);
      }
      moveScrollToReceiveMessage();
    },
    [moveScrollToReceiveMessage]
  );

  useEffect(() => {
    setMessages([]);

    // 채팅방을 떠났을 경우 소켓에 메세지를 보내기 위해 이전 방정보기준으로 비교함
    if (prevRoom && prevRoom.roomId !== room.roomId) {
      socket.emit(SOCKET_EVENT.LEAVE_ROOM, {
        nickName: user.displayName,
        roomId: prevRoom.roomId,
      });

      // 소켓에 메시지를 보내고 난뒤 현재의 방정보를 prevRoom에 저장함
      setPrevRoom(room);
    } else {
      // 처음 Room 저장
      setPrevRoom(room);
    }
    socket.emit(SOCKET_EVENT.JOIN_ROOM, {
      nickName: user.displayName,
      roomId: room.roomId,
    });
  }, [room]);

  useEffect(() => {
    socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, handleChangeMessage);
    socket.on(SOCKET_EVENT.LEAVE_ROOM, handleChangeMessage);
    return () => {
      socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, handleChangeMessage);
      socket.on(SOCKET_EVENT.LEAVE_ROOM, handleChangeMessage);
    };
  }, [socket, handleChangeMessage]);

  return (
    <>
      <h5>
        <span style={{ fontWeight: "bold" }}>{room.roomName}</span> 채팅방에
        오신걸 환영합니다.
      </h5>
      <div className="d-flex flex-column">
        <div className="chat-window card" ref={chatWindow}>
          {messages.map((message, index) => {
            const { nickName, content, time, roomId } = message;
            // messages 배열을 map함수로 돌려 각 원소마다 item을 렌더링 해줍니다.
            return (
              <div
                key={index}
                className={
                  nickName && user.displayName !== nickName
                    ? "otherUser"
                    : "d-flex flex-row"
                }
              >
                {!nickName && (
                  <>
                    <div>{content}</div>
                    <div className="time">{time}</div>
                  </>
                )}
                {nickName && user.displayName === nickName && (
                  <>
                    <div className="message-nickname">{nickName}</div>
                    <div>{content}</div>
                    <div className="time">{time}</div>
                  </>
                )}

                {room.roomId === roomId &&
                nickName &&
                user.displayName !== nickName && ( //소켓의 roomId가 현재의 roomId와 같지 않다면 상대방의 채팅을 표시하지 않는다.
                    <>
                      <div className="message-nickname">{nickName}</div>
                      <div>{content}</div>
                      <div className="time">{time}</div>
                    </>
                  )}
              </div>
            );
          })}
        </div>
        {user && (
          <MessageForm nickName={user.displayName} roomId={room.roomId} />
        )}
      </div>
    </>
  );
};

export default ChatRoom;
