import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useAuth } from "services/authprovider";
import FbDatabase from "services/firebase/database";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { onValue } from "firebase/database";
import ChatRoom from "./chatRoom";
import { socket, SocketContext, SOCKET_EVENT } from "services/socket";

const db = new FbDatabase(false);

type ChatRoomType = {
  roomName: string;
  roomId: string;
  created: Date;
  participants: string[];
  owner: string;
};

const ChatRoomList = () => {
  const [selected, setSelected] = useState(null as ChatRoomType);
  const [open, setOpen] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([] as ChatRoomType[]);

  useEffect(() => {
    // 채팅룸 참조 객체
    var roomsRef = db.getRef(`/chatrooms`);
    // 채팅룸의 변화가 감지되면 실행
    onValue(roomsRef, () => {
      db.getChatRooms().then((rooms) => {
        setChatRooms(rooms);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // user가 있을 경우 방 목록을 가져온다.
  useEffect(() => {
    if (user) {
      // 해당 유저가 방에 이미 참가해 있는지 여부에 따라 소켓에 전송한다.
      socket.emit(SOCKET_EVENT.JOIN_ROOM, { nickName: user.displayName });

      // 해당 유저가 방에 이미 참가해있었으면 이전 대화 목록을 가져온다.

      //
      db.getChatRooms().then((rooms) => {
        setChatRooms(rooms);
      });
    }
  }, [user]);

  // 방생성 버튼 클릭시
  const handleAddChatRoom = () => {
    db.createRoom(user.uid, chatTitle).then((result) => {
      if (result) {
        alert("방을 생성하였습니다.");
        setOpen(false);
      } else {
        alert("방을 생성하지 못했습니다.");
        return;
      }
    });
  };

  return (
    <>
      <div>
        <Button
          variant="outlined"
          onClick={() => {
            setOpen(true);
          }}
        >
          추가
        </Button>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <DialogTitle>채팅방 추가</DialogTitle>
          <DialogContent>
            <DialogContentText>채팅방 이름을 정해주세요.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="chat room name"
              type="text"
              variant="standard"
              onChange={(e) => {
                setChatTitle(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              취소
            </Button>
            <Button onClick={handleAddChatRoom}>생성</Button>
          </DialogActions>
        </Dialog>
      </div>
      <List sx={{ width: 500, bgcolor: "Background.paper" }}>
        {chatRooms.map((room) => {
          return (
            <>
              <ListItem
                alignItems="flex-start"
                onClick={() => {
                  setSelected(room);
                }}
              >
                <ListItemAvatar>
                  <Avatar alt="" src="" />
                </ListItemAvatar>
                <ListItemText
                  primary={room.roomName}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color={"text.secondary"}
                      >
                        {room.participants.map((participant) => {
                          return participant + ",";
                        })}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider />
            </>
          );
        })}
        {selected && <ChatRoom room={selected} />}
      </List>
    </>
  );
};

export default ChatRoomList;
