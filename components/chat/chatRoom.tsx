import FileModal from "components/util/filemodal";
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
  const [messageTyping, setMessageTyping] = useState([] as any[]);
  const [isOpen, setIsOpen] = useState(false);

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
        // 채팅을 typing 중인 상태일 경우 처리
      } else if (newMessage.type === SOCKET_EVENT.TYPING_MESSAGE) {
        if (!newMessage.typingFlag) {
          setMessageTyping([]); // 입력중인 메시지가 없을 경우에는 표시하지 않도록 처리
        } else {
          setMessageTyping([]);
          setMessageTyping((messages) => [...messages, newMessage]);
        }
      } else {
        //채팅이 입력되었을 경우에는 typing 입력창은 비워주도록 한다.
        setMessages((messages) => [...messages, newMessage]);
        setMessageTyping([]);
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
        uid: user.uid,
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
      uid: user.uid,
      nickName: user.displayName,
      roomId: room.roomId,
    });
  }, [room]);

  useEffect(() => {
    socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, handleChangeMessage);
    socket.on(SOCKET_EVENT.LEAVE_ROOM, handleChangeMessage);
    socket.on(SOCKET_EVENT.TYPING_MESSAGE, handleChangeMessage);
    return () => {
      //TODO: 페이지 이동이나 새로고침 페이지가 꺼졌을 때 방을 떠났다는 메시지를 보내도록 해야한다.(해당 시점을 찾는게 중요)
      socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, handleChangeMessage);
      socket.on(SOCKET_EVENT.LEAVE_ROOM, handleChangeMessage);
      socket.on(SOCKET_EVENT.TYPING_MESSAGE, handleChangeMessage);
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
            const { uid, nickName, content, time, roomId } = message;
            // messages 배열을 map함수로 돌려 각 원소마다 item을 렌더링 해줍니다.
            return (
              <div
                key={index}
                className={
                  uid && user.uid !== uid ? "otherUser" : "d-flex flex-row"
                }
              >
                {uid && user.uid === uid && (
                  //본인 채팅
                  <>
                    <div className="message-nickname">{nickName}</div>
                    <div
                      className="message-content"
                      style={{ background: "yellow", color: "black" }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: content }}></div>
                    </div>
                    <div className="message-time">
                      {new Date(time).toLocaleString()}
                    </div>
                  </>
                )}

                {room.roomId === roomId && uid && user.uid !== uid && (
                  //상대방채팅
                  //소켓의 roomId가 현재의 roomId와 같지 않다면 상대방의 채팅을 표시하지 않는다.
                  <>
                    <div className="message-nickname">{nickName}</div>
                    <br />
                    <div
                      className="message-content"
                      style={{ background: "gray", color: "white" }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: content }}></div>
                    </div>
                    <br />
                    <div className="message-time">
                      {new Date(time).toLocaleString()}
                    </div>
                  </>
                )}
              </div>
            );
          })}
          {messageTyping.map((message, index) => {
            const { uid, nickName } = message;
            return (
              <>
                {user.uid !== uid && (
                  <div
                    key={index}
                    className={"otherUser"}
                    style={{ width: "20%" }}
                  >
                    <div className="message-nickname">{nickName}</div>
                    <img src="./img/keyboard.gif" />
                  </div>
                )}
              </>
            );
          })}
        </div>
        {user && (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <MessageForm
              uid={user.uid}
              nickName={user.displayName}
              roomId={room.roomId}
            />
            <button
              onClick={() => {
                setIsOpen(true);
              }}
            >
              gif
              <br />
              첨부
            </button>
          </div>
        )}
        {isOpen && (
          <FileModal
            uid={user.uid}
            onClose={() => {
              setIsOpen(false);
            }}
            customClick={(url) => {
              console.log(url);
              // 소켓서버에 메시지를 전송
              socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
                uid: user.uid,
                nickName: user.displayName,
                content: `<img src="${url}" width="60px" style="border-radius:50px"/>`,
                roomId: room.roomId,
              });

              setIsOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default ChatRoom;
