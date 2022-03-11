import { useCallback, useContext, useState } from "react";
import { SocketContext, SOCKET_EVENT } from "services/socket";

const MessageForm = ({ nickName }) => {
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
    });

    setTypingMessage("");
  }, [socket, typingMessage]);
  return (
    <form className="card">
      <div className="d-flex align-items-center">
        <textarea
          className="form-control"
          maxLength={400}
          autoFocus
          value={typingMessage}
          onChange={handleChangeTypingMessage}
        />
        <button
          type="button"
          className="btn btn-primary send-btn"
          onClick={handleSendMesssage}
        >
          전송
        </button>
      </div>
    </form>
  );
};

export default MessageForm;
