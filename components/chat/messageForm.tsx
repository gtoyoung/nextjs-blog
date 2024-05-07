import { useCallback, useContext, useState } from "react";
import { SocketContext, SOCKET_EVENT } from "services/socket";
import _ from "lodash";

const MessageForm = ({ uid, nickName, roomId, children }) => {
  const [typingMessage, setTypingMessage] = useState("");
  const socket = useContext(SocketContext);

  // 텍스트를 입력하면 typingMessage state를 변경
  const handleChangeTypingMessage = useCallback((event) => {
    if (event.target.value === "") {
      socket.emit(SOCKET_EVENT.TYPING_MESSAGE, {
        uid,
        nickName,
        content: event.target.value,
        roomId,
        typing: false,
      });
    } else {
      socket.emit(SOCKET_EVENT.TYPING_MESSAGE, {
        uid,
        nickName,
        content: event.target.value,
        roomId,
        typing: true,
      });
    }
    setTypingMessage(event.target.value);
  }, []);

  const handleSendMesssage = useCallback(() => {
    const noContent = typingMessage.trim() === "";

    //아무 메시지가 없을 경우 발생하지 않음
    if (noContent) {
      return;
    }
    // 소켓서버에 메시지를 전송
    socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
      uid,
      nickName,
      content: typingMessage,
      roomId,
    });

    setTypingMessage("");
  }, [socket, typingMessage]);

  return (
    <form className="card_msg">
      <div className="d-flex align-items-center" style={{ display: "flex" }}>
        <textarea
          className="large-input"
          maxLength={400}
          style={{ width: "100%" }}
          autoFocus
          value={typingMessage}
          onChange={handleChangeTypingMessage}
          onKeyDown={(e) => {
            if (e.keyCode == 13 && e.shiftKey == false) {
              e.preventDefault();
              handleSendMesssage();
            }
          }}
        />
        {children}
      </div>
    </form>
  );
};

export default MessageForm;
