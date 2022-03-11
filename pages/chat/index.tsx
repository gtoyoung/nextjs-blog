import ChatRoomList from "components/chat/chatRoomList";
import { Layout } from "components/layout";
import React from "react";
import { useAuth } from "services/authprovider";
import { socket, SocketContext } from "services/socket";
import "./style.css";

const ChatPage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {user ? (
        <SocketContext.Provider value={socket}>
          <ChatRoomList />
        </SocketContext.Provider>
      ) : (
        <>로그인이 필요한 페이지 입니다.</>
      )}
    </Layout>
  );
};

export default ChatPage;
