import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FbDatabase from "services/database";

export default function FormDialog({
  uId,
  postId,
  defaultTitle,
  defaultContent,
  closeHandler,
  created,
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status] = useState("draft");
  const [isNew, setIsNew] = useState(true);
  const db = new FbDatabase();
  useEffect(() => {
    // 기존에 등록된 내용이 있을 경우 셋팅
    if (postId) {
      setTitle(defaultTitle);
      setContent(defaultContent);
      // 업데이트라는것으로 인지
      setIsNew(false);
      // 업데이트일 경우에는 팝업창을 바로띄운다.
      setOpen(true);
    } else {
      setTitle("");
      setContent("");
      setIsNew(true);
      setOpen(false);
    }
  }, []);

  const handleSubmit = () => {
    if (title === "") {
      alert("제목을 입력해주세요");
      return;
    } else if (content === "") {
      alert("내용을 입력해주세요");
      return;
    }
    if (isNew) {
      db.writePost(uId, title, content)
        .then((result) => {
          if (result) {
            alert("저장되었습니다.");
            setOpen(false);
          } else {
            alert("저장에 실패하였습니다.");
          }
          setTitle("");
          setContent("");
        })
        .catch(() => {
          alert("저장에 실패하였습니다.");
        });
    } else {
      db.updatePost(uId, postId, title, content, created, status)
        .then((result) => {
          if (result) {
            alert("저장되었습니다.");
            setOpen(false);
          } else {
            alert("저장에 실패하였습니다.");
          }
          setTitle("");
          setContent("");
        })
        .catch(() => {
          alert("수정에 실패했습니다.");
        });
    }
  };

  // // 관리자일 경우만 동작가능
  // const completeRequirement = () => {
  //   setStatus("complete");
  // };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    closeHandler();
  };

  return (
    <div>
      {isNew ? (
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          style={{ marginTop: "15px" }}
        >
          등록하기
        </Button>
      ) : (
        <></>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Require</DialogTitle>
        <DialogContent>
          <DialogContentText>
            이 블로그에 추가하면 좋을 것 같은 것들을 작성해서 올려주세요.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            id="content"
            label="Content"
            type="text"
            fullWidth
            variant="standard"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isNew ? "Create" : "Update"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
