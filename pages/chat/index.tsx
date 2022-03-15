import ChatRoom from "components/chat/chatRoom";
import ChatSliderMenu from "components/chat/chatSliderMenu";
import { Layout } from "components/layout";
import useTheme from "hook/useTheme";
import React, { useEffect, useState } from "react";
import { useAuth } from "services/authprovider";
import { socket, SocketContext } from "services/socket";

const ChatPage = () => {
  const { user } = useAuth();
  const [selectRoom, setSelectRoom] = useState(null as any);
  const [theme] = useTheme();
  useEffect(() => {
    socket.connect();
  }, []);
  return (
    <Layout>
      {user ? (
        <>
          <SocketContext.Provider value={socket}>
            <ChatSliderMenu
              selectedRoom={(room) => {
                setSelectRoom(room);
              }}
              color={theme === "light" ? "black" : "white"}
            />
            {selectRoom && <ChatRoom room={selectRoom} />}
          </SocketContext.Provider>
        </>
      ) : (
        <h3>로그인이 필요한 페이지 입니다.</h3>
      )}
    </Layout>
  );
};

export default ChatPage;
