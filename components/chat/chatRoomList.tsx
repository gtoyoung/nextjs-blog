import React, { Fragment, useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useAuth } from "services/authprovider";
import FbDatabase from "services/firebase/database";
import { css } from "@emotion/css";
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
import { GoogleApi } from "services/google";
import "./style.css";

const easeSlow = css`
  transition: all 450ms ease-in-out;
`;

const menuBtn = css`
  position: absolute;
  z-index: 3;
  right: 0;
  cursor: pointer;
  ${easeSlow};
  &.closer {
    transform: rotate(180deg);
  }
`;

const btnLine = css`
  width: 28px;
  height: 4px;
  margin: 0 0 5px 0;
  background-color: #71c57f;
  ${easeSlow};
  &.closer {
    background-color: #e76e81;
    &:nth-child(1) {
      transform: rotate(45deg) translate(4px, 0px);
      width: 20px;
    }
    &:nth-child(2) {
      transform: translateX(-8px);
    }
    &:nth-child(3) {
      transform: rotate(-45deg) translate(4px, 0px);
      width: 20px;
    }
  }
`;

const menuOverlay = css`
  z-index: 2;
  position: fixed;
  top: 0;
  right: 0;
  background-color: white;
  height: 100vh;
  width: 40vw;
  transform: translateX(100%);
  transition: all 500ms ease-in-out;
  &.show {
    background-color: white;
    transform: translateX(0%);
  }
  nav {
    background-color: white;
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    div {
      margin: 0;
      margin-bottom: 5px;
    }
    ul {
      list-style: none;
      padding-top: 8px;
      padding-bottom: 8px;
      width: 100%;
      background-color: #fff;
    }
    li {
      text-decoration: none;
      width: 100%;
      box-sizing: border-box;
      text-align: left;
      padding-top: 8px;
      padding-bottom: 8px;
      padding-left: 16px;
      padding-right: 16px;
      overflow-wrap: break-word;
      &:hover {
        color: #f28eba;
      }
      border: 1px solid #e5e5e5;
      border-radius: 15px;
    }
    li:before {
      content: "";
    }
    hr:after {
      content: "";
    }
    a {
      height: 30px;
      text-decoration: none;
      color: #eb4c54;
      cursor: pointer;
      transition: all 150ms ease-in-out;
      &:hover {
        color: #f28eba;
      }
      p {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    span {
      font-size: 0.7rem;
      color: black;
    }
  }
  @media (max-width: 800px) {
    width: 100vw;
  }
`;

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

const ChatRoomList = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null as ChatRoomType);
  const [open, setOpen] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([] as ChatRoomType[]);

  useEffect(() => {
    // ????????? ?????? ??????
    var roomsRef = db.getRef(`/chatrooms`);
    // ???????????? ????????? ???????????? ??????
    onValue(roomsRef, () => {
      var convertRooms = [] as ChatRoomType[];
      db.getChatRooms().then((rooms) => {
        rooms.forEach((room) => {
          // ????????? ????????????
          convertName(room.participants).then((displayNames) => {
            convertRooms.push({
              roomName: room.roomName,
              roomId: room.roomId,
              created: room.created,
              participants: room.participants,
              displayNames: displayNames,
              owner: room.owner,
            });
          });
        });
        setChatRooms(convertRooms);
      });
    });
  }, []);

  // user??? ?????? ?????? ??? ????????? ????????????.
  useEffect(() => {
    if (user) {
      var convertRooms = [] as ChatRoomType[];
      db.getChatRooms().then((rooms) => {
        rooms.forEach((room) => {
          // ????????? ????????????
          convertName(room.participants).then((displayNames) => {
            convertRooms.push({
              roomName: room.roomName,
              roomId: room.roomId,
              created: room.created,
              participants: room.participants,
              displayNames: displayNames,
              owner: room.owner,
            });
          });
        });
        setChatRooms(convertRooms);
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

  // ????????? ?????? ?????????
  const handleAddChatRoom = () => {
    db.createRoom(user.uid, chatTitle).then((result) => {
      if (result) {
        alert("?????? ?????????????????????.");
        setOpen(false);
      } else {
        alert("?????? ???????????? ???????????????.");
        return;
      }
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Fragment>
        <div
          className={`${menuBtn} ${isMenuOpen ? "closer" : null}`}
          onClick={toggleMenu}
        >
          <div className={`${btnLine} ${isMenuOpen ? "closer" : null}`} />
          <div className={`${btnLine} ${isMenuOpen ? "closer" : null}`} />
          <div className={`${btnLine} ${isMenuOpen ? "closer" : null}`} />
        </div>
        <div className={`${menuOverlay} ${isMenuOpen ? "show" : null}`}>
          <nav>
            <a
              href="#javascript"
              onClick={() => {
                setOpen(true);
              }}
            >
              ??????
            </a>
            <Dialog
              open={open}
              onClose={() => {
                setOpen(false);
              }}
            >
              <DialogTitle>????????? ??????</DialogTitle>
              <DialogContent>
                <DialogContentText>????????? ????????? ???????????????.</DialogContentText>
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
                  ??????
                </Button>
                <Button onClick={handleAddChatRoom}>??????</Button>
              </DialogActions>
            </Dialog>
            <List sx={{ width: 500, bgcolor: "Background.paper" }}>
              {chatRooms.map((room) => {
                return (
                  <>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt=""
                          src=""
                          onClick={(_e) => {
                            // ?????? ????????? ???????????? ?????? ??????
                            if (room.owner === user.uid) {
                              if (confirm("???????????? ?????????????????????????")) {
                                db.deleteChatRoom(user.uid, room.roomId)
                                  .then(() => {
                                    setSelected(null);
                                  })
                                  .catch(() => {
                                    alert("????????? ????????? ??????????????????.");
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
                            // ????????? ???????????? ???????????? ??????????????? ?????? ???????????? ?????? ??????
                            if (confirm("???????????? ?????????????????????????")) {
                              db.participantJoin(user.uid, room.roomId)
                                .then(() => {
                                  setSelected(room);
                                })
                                .catch(() => {
                                  alert("????????? ????????? ??????????????????.");
                                });
                            }
                          }
                        }}
                        primary={room.roomName}
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
                  </>
                );
              })}
            </List>
          </nav>
        </div>
      </Fragment>
      {selected && <ChatRoom room={selected} />}
    </>
  );
};

export default ChatRoomList;
