import ChatRoomList from "components/chat/chatRoomList";
import { Layout } from "components/layout";
import React, { useEffect } from "react";
import { useAuth } from "services/authprovider";
import { socket, SocketContext } from "services/socket";
import "./style.css";

const ChatPage = () => {
  const { user } = useAuth();

  useEffect(() => {
    //채팅페이지를 나갔을 경우 소켓 연결을 끊음
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Layout>
      {user ? (
        <>
          <SocketContext.Provider value={socket}>
            <ChatRoomList />
          </SocketContext.Provider>
        </>
      ) : (
        <h3>로그인이 필요한 페이지 입니다.</h3>
      )}
    </Layout>
  );
};

export default ChatPage;
