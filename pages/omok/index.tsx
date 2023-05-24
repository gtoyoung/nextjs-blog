import { Layout } from "components/layout";
import { GamingRoom } from "components/omok/GamingRoom";
import { WatingRoom } from "components/omok/WaitingRoom";
import { useEffect, useState } from "react";
import { SocketContext, socket } from "services/socket";
import { OmokRoom } from "type/omok.types";
import "./style.css";

export const OMOK_EVENT = {
  ROOM_LIST: "room_list",
  ROOM_NEW: "room_new",
  ROOM_ENTER: "room_enter",
  ROOM_LEAVE: "room_leave",
  PLAYER_CHANGE: "player_change",
  PLAYER_SELECT: "player_select",
  PLAYER_SELECTED: "player_selected",
  PLAYER_READY: "player_ready",
  MESSAGE: "message",
  SEND_MESSAGE: "send_message",
};

const OmokPage = () => {
  const [publicRoom, setPublicRoom] = useState<OmokRoom>();

  useEffect(() => {
    socket.on(OMOK_EVENT.ROOM_ENTER, (room: OmokRoom) => {
      console.log(`Enter room ${room.name}`);
      setPublicRoom(room);
    });

    socket.on(OMOK_EVENT.ROOM_LEAVE, () => {
      setPublicRoom(null);
    });
  }, []);

  return (
    <Layout isMax={true}>
      <>
        <SocketContext.Provider value={socket}>
          <div id="omokWrapper">
            <h1 className="title">오목 게임</h1>
            {publicRoom?.name === undefined ? <WatingRoom /> : <GamingRoom publicRoom={publicRoom} />}
          </div>
        </SocketContext.Provider>
      </>
    </Layout>
  );
};

export default OmokPage;
