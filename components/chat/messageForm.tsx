import { useCallback, useContext, useState } from "react";
import { SocketContext, SOCKET_EVENT } from "services/socket";

const MessageForm = ({ nickName, roomId }) => {
  const [typingMessage, setTypingMessage] = useState("");
  const socket = useContext(SocketContext);

  // 텍스트를 입력하면 typingMessage state를 변경
  const handleChangeTypingMessage = useCallback((event) => {
    setTypingMessage(event.target.value);
  }, []);

  const handleSendMesssage = useCallback(() => {
    const noContent = typingMessage.trim() === "";

    //아무 메시지가 없을 경우 발생하지 않음
    if (noContent) {
      return;
    }
    // 닉네임과 함께 소켓서버에 메시지를 전송
    socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
      nickName,
      content: typingMessage,
      roomId,
    });

    setTypingMessage("");
  }, [socket, typingMessage]);
  return (
    <form className="card">
      <div className="d-flex align-items-center">
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
      </div>
    </form>
  );
};

export default MessageForm;
