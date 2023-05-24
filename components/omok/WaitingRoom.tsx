import { OMOK_EVENT } from "pages/omok";
import { useEffect, useState } from "react";
import { socket } from "services/socket";
import { OmokRoom } from "type/omok.types";

export const WatingRoom = () => {
  const [roomList, setRoomList] = useState<OmokRoom[]>();

  useEffect(() => {
    socket.on(OMOK_EVENT.ROOM_LIST, (list: OmokRoom[]) => {
      setRoomList(list);
    });

    socket.emit(OMOK_EVENT.ROOM_LIST);

    return () => {
      socket.off(OMOK_EVENT.ROOM_LIST);
    };
  }, []);

  return (
    <div className="waitings-room">
      <NewRoom />
      <RoomList roomList={roomList} />
    </div>
  );
};

const NewRoom = () => {
  const handleNewRoom = (event) => {
    event.preventDefault();
    const name: string = event.target.roomname.value;
    event.target.roomname.value = "";
    if (name.length == 0) return;
    socket.emit(OMOK_EVENT.ROOM_NEW, name);
  };

  return (
    <div className="newroom">
      <form className="newroom__form" onSubmit={handleNewRoom}>
        <input className="newroom__input" type="text" name="roomname" placeholder="방 이름"></input>
        <button className="newroom__submit">방 만들기</button>
      </form>
    </div>
  );
};

const RoomItem = (room: OmokRoom) => {
  const handleEnterRoom = () => {
    socket.emit(OMOK_EVENT.ROOM_ENTER, room.name);
  };

  return (
    <li key={room.name} className="room-list__item">
      <p className="room-list__name">{room.name}</p>
      <button className="room-list__enter" onClick={handleEnterRoom}>
        입장하기
      </button>
    </li>
  );
};

const RoomList = ({ roomList }: { roomList: OmokRoom[] }) => {
  return (
    <div className="room-list">
      <h3>방 목록</h3>
      <ul className="room-list__container">{roomList?.map(RoomItem)}</ul>
    </div>
  );
};
