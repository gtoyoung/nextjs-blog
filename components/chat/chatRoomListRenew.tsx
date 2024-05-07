import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { onValue } from "firebase/database";
import React, { Fragment, useEffect, useState } from "react";
import { useAuth } from "services/authprovider";
import FbDatabase from "services/firebase/database";
import { GoogleApi } from "services/google";

const db = new FbDatabase(false);
const googleApi = new GoogleApi();

type ChatRoomType = {
  roomName: string;
  roomId: string;
  created: Date;
  displayNames: string[];
  participants: string[];
  owner: string;
};

const ChatRoomListRenew = ({ selectedRoom, closedMenu }) => {
  const [, setSelected] = useState(null as ChatRoomType);
  const [open, setOpen] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([] as ChatRoomType[]);

  useEffect(() => {
    // 채팅룸 참조 객체
    var roomsRef = db.getRef(`/chatrooms`);
    // 채팅룸의 변화가 감지되면 실행
    onValue(roomsRef, () => {
      var convertRooms = [] as ChatRoomType[];
      db.getChatRooms().then((rooms) => {
        const promiseArr = [] as Promise<any>[];
        rooms.forEach((room) => {
          promiseArr.push(
            convertName(room.participants).then((displayNames) => {
              convertRooms.push({
                roomName: room.roomName,
                roomId: room.roomId,
                created: room.created,
                participants: room.participants,
                displayNames: displayNames,
                owner: room.owner,
              });
            })
          );
        });
        Promise.all(promiseArr).then(() => {
          setChatRooms(convertRooms);
        });
      });
    });
  }, []);

  // user가 있을 경우 방 목록을 가져온다.
  useEffect(() => {
    if (user) {
      var convertRooms = [] as ChatRoomType[];
      db.getChatRooms().then((rooms) => {
        const promiseArr = [] as Promise<any>[];
        rooms.forEach((room) => {
          promiseArr.push(
            convertName(room.participants).then((displayNames) => {
              convertRooms.push({
                roomName: room.roomName,
                roomId: room.roomId,
                created: room.created,
                participants: room.participants,
                displayNames: displayNames,
                owner: room.owner,
              });
            })
          );
        });
        Promise.all(promiseArr).then(() => {
          setChatRooms(convertRooms);
        });
      });
    }
  }, [user]);

  const convertName = async (participants: string[]) => {
    var converts = [] as string[];
    await participants.forEach(async (participant) => {
      googleApi.getUserInfo(participant).then((userInfo) => {
        converts.push(userInfo.displayName);
      });
    });
    return converts;
  };

  // 방생성 버튼 클릭시
  const handleAddChatRoom = () => {
    db.createRoom(user.uid, chatTitle).then((result) => {
      if (result) {
        closedMenu();
        setOpen(false);
        alert("방을 생성하였습니다.");
      } else {
        alert("방을 생성하지 못했습니다.");
        return;
      }
    });
  };

  return (
    <>
      <Fragment>
        <div style={{ float: "right" }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setOpen(true);
            }}
          >
            방 추가
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
        <br />
        <Divider style={{ paddingTop: "20px", paddingLeft: "25%" }}>
          <Chip label="방 목록" />
        </Divider>
        <br />
        <List sx={{ width: 500, bgcolor: "Background.paper" }} aria-labelledby="nested-list-subheader" component="div">
          {chatRooms.map((room) => {
            return (
              <>
                <a href="#javascript">
                  <ListItem alignItems="flex-start" style={{ border: "1px solid black" }}>
                    <ListItemAvatar>
                      <Avatar
                        alt=""
                        src=""
                        onClick={(_e) => {
                          // 방의 주인일 경우에만 삭제 가능
                          if (room.owner === user.uid) {
                            if (confirm("채팅방을 삭제하시겠습니까?")) {
                              db.deleteChatRoom(user.uid, room.roomId)
                                .then(() => {
                                  closedMenu();
                                  setSelected(null);
                                })
                                .catch(() => {
                                  alert("채팅방 삭제에 실패했습니다.");
                                });
                            } else {
                              return;
                            }
                          }
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      onClick={() => {
                        if (room.participants.includes(user.uid)) {
                          setSelected(room);
                        } else {
                          // 채팅방 참여자가 아닐경우 참여의사를 묻고 참여자로 정보 셋팅
                          if (confirm("채팅방에 참여하시겠습니까?")) {
                            db.participantJoin(user.uid, room.roomId)
                              .then(() => {
                                setSelected(room);
                              })
                              .catch(() => {
                                alert("채팅방 입장에 실패했습니다.");
                              });
                          }
                        }
                        selectedRoom(room);
                      }}
                      primary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color={"black"}
                            fontSize={"0.8rem"}
                          >
                            {room.roomName}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="p"
                            variant="body2"
                            color={"text.secondary"}
                            fontSize={"0.6rem"}
                          >
                            {room.displayNames.join(",")}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </a>
                <br />
              </>
            );
          })}
        </List>
      </Fragment>
    </>
  );
};

export default ChatRoomListRenew;
