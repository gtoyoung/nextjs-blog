import { Layout } from "components/layout";
// import useTheme from "hook/useTheme";
import React, { useEffect } from "react";
import { socket } from "services/socket";

const ChatPage = () => {
  // const [theme] = useTheme();
  useEffect(() => {
    socket.connect();
  }, []);

  return (
    <Layout>
      <></>
    </Layout>
  );
};

export default ChatPage;
