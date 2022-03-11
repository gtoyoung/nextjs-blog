import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "services/authprovider";
import { SocketContext, SOCKET_EVENT, makeMessage } from "services/socket";
import MessageForm from "./messageForm";

const ChatRoom = ({ room }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([] as any[]);
  const chatWindow = useRef(null);
  const socket = useContext(SocketContext);

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
      setMessages((messages) => [...messages, newMessage]);
      moveScrollToReceiveMessage();
    },
    [moveScrollToReceiveMessage]
  );

  useEffect(() => {
    socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, handleChangeMessage);

    return () => {
      socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, handleChangeMessage);
    };
  }, [socket, handleChangeMessage]);

  return (
    <div className="d-flex flex-column" style={{ width: 1000 }}>
      <div className="chat-window card" ref={chatWindow}>
        {messages.map((message, index) => {
          const { nickName, content, time } = message;
          // messages 배열을 map함수로 돌려 각 원소마다 item을 렌더링 해줍니다.
          return (
            <div key={index} className="d-flex flex-row">
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
              {nickName && user.displayName !== nickName && (
                <>
                  <div className="message-nickname">{nickName}-상대방</div>
                  <div>{content}</div>
                  <div className="time">{time}</div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {user && <MessageForm nickName={user.displayName} />}
    </div>
  );
};

export default ChatRoom;
