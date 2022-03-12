import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FbDatabase from "services/firebase/database";
import { GoogleApi } from "services/google";

export default function FormDialog({
  uId,
  postId,
  defaultTitle,
  defaultContent,
  closeHandler,
  isAdmin,
  status,
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isNew, setIsNew] = useState(true);
  const googleApi = new GoogleApi();
  const db = new FbDatabase(isAdmin);
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
            closeHandler();
          } else {
            alert("저장에 실패하였습니다.");
            closeHandler();
          }
          setTitle("");
          setContent("");
        })
        .catch(() => {
          alert("저장에 실패하였습니다.");
          closeHandler();
        });
    } else {
      db.updatePost(uId, postId, title, content, status)
        .then((result) => {
          if (result) {
            alert("저장되었습니다.");
            setOpen(false);
            closeHandler();
          } else {
            alert("저장에 실패하였습니다.");
            closeHandler();
          }
          setTitle("");
          setContent("");
        })
        .catch(() => {
          alert("수정에 실패했습니다.");
          closeHandler();
        });
    }
  };

  const pushMsg = () => {
    // 사용자의 토큰 리스트를 가져온다.
    db.getTokens(uId).then((tokens) => {
      const message = `'${title}'에 대한 요구사항이 완료 되었습니다.`;
      googleApi
        .pushMsg(tokens, message)
        .then((result) => {
          console.log(result);
        })
        .catch(() => {
          console.log("pushMsg error");
        });
    });
  };

  // 관리자일 경우만 동작가능
  const completeRequirement = () => {
    db.updatePost(uId, postId, title, content, "complete")
      .then(() => {
        alert("완료되었습니다.");
        setOpen(false);
        closeHandler();
        pushMsg();
      })
      .catch(() => {
        alert("완료에 실패했습니다.");
        closeHandler();
      });
  };

  const reverComplete = () => {
    db.updatePost(uId, postId, title, content, "draft")
      .then(() => {
        alert("되돌리었습니다.");
        setOpen(false);
        closeHandler();
      })
      .catch(() => {
        alert("되돌리기에 실패했습니다.");
        closeHandler();
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    closeHandler();
  };

  const handleDelete = () => {
    if (confirm("삭제하시겠습니까?")) {
      db.deletePost(uId, postId)
        .then((result) => {
          if (result) {
            alert("삭제되었습니다.");
            setOpen(false);
            closeHandler();
          } else {
            alert("삭제에 실패했습니다.");
          }
          setTitle("");
          setContent("");
        })
        .catch(() => {
          alert("삭제에 실패했습니다.");
        });
    }
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
            variant="filled"
            value={title}
            disabled={!isNew && status === "complete" && !isAdmin}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            id="content"
            label="Content"
            type="text"
            fullWidth
            multiline
            maxRows={5}
            variant="filled"
            value={content}
            disabled={!isNew && status === "complete" && !isAdmin}
            onChange={(e) => setContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          {isAdmin && !isNew && (
            <>
              {status === "draft" || status === undefined ? (
                <Button onClick={completeRequirement}>Complete</Button>
              ) : (
                <Button onClick={reverComplete}>Draft</Button>
              )}
            </>
          )}
          {!isNew && (status === "draft" || isAdmin) && (
            <>
              <Button onClick={handleDelete}>Delete</Button>
              <Button onClick={handleSubmit}>Update</Button>
            </>
          )}
          {isNew && <Button onClick={handleSubmit}>Create</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
