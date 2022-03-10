import { Layout } from "components/layout";
import { Balloon } from "components/todo";
import FormDialog from "components/todo/dialog";
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import AuthService from "services/firebase/auth";
import FbDatabase from "services/firebase/database";
import { Post, PostDetail } from "services/google.types";
import { Board } from "components/todo/board";
import { StorageToggle } from "components/util/storagetoggle";
import FileModal from "components/util/filemodal";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "components/util/authprovider";
const Todo = () => {
  const { user } = useAuth();
  const [post, setPost] = useState(null as PostDetail);
  const [posts, setPosts] = useState([] as Post[]);
  const [isEdit, setIsEdit] = useState(false);
  const [type, setType] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [profile, setProfile] = useState("");
  const authService = new AuthService();
  let db = new FbDatabase(isAdmin);

  useEffect(() => {
    var token = localStorage.getItem("token");
    // 로그인 직후만 동작하는 토큰 저장 함수
    getRedirectResult(authService.auth()).then((result) => {
      if (result && result.user) {
        db.writeToken(result.user.uid, token);
      }
    });
  }, []);

  useEffect(() => {
    onAuthStateChanged(authService.auth(), (user) => {
      if (user) {
        // setUser(authService.getProfile(user));

        user.getIdTokenResult().then((result) => {
          if (result.claims.admin) {
            db = new FbDatabase(true);
            setIsAdmin(true);
          }
        });

        db.getProfileImg(user.uid).then((result) => {
          if (result === "") {
            setProfile(user.photoURL);
          } else {
            setProfile(result);
          }
        });

        db.getPosts(user.uid)
          .then((result) => {
            const userPost = [] as Post[];
            result.forEach((data) => {
              userPost.push({
                postId: data.postId,
                post: {
                  title: data.title,
                  content: data.content,
                  created: data.created,
                  modified: data.modified,
                  status: data.status,
                  postId: data.postId,
                },
              });
            });
            setPosts(userPost);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }, [posts]);

  const handleLogin = () => {
    authService.login("google");
  };

  const handleClose = () => {
    setIsEdit(false);
  };

  const showToggle = () => {
    setType(!type);
  };

  const handleAdd = () => {
    setIsAdd(true);
  };

  const handleAddClose = () => {
    setIsAdd(false);
  };

  return (
    <Layout>
      {user ? (
        <div>
          <div style={{ display: "flex", marginTop: "10px" }}>
            {profile === "" ? (
              <>
                <Box sx={{ display: "flex" }}>
                  <CircularProgress />
                </Box>
              </>
            ) : (
              <>
                <img
                  src={profile}
                  loading="lazy"
                  alt="profile"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                  }}
                  onClick={handleAdd}
                />
              </>
            )}

            <h3 style={{ margin: "20px" }}>
              {user.displayName} 님 환영합니다!{" "}
            </h3>
          </div>
          <div style={{ display: "flex" }}>
            <h4 style={{ margin: "20px" }}>요구사항을 등록해주세요.</h4>
            <FormDialog
              uId={user.uid}
              defaultContent={""}
              defaultTitle={""}
              created={""}
              postId={null}
              closeHandler={handleClose}
              isAdmin={isAdmin}
              status={""}
            />
          </div>
          <StorageToggle
            toggle={showToggle}
            falseText={"board"}
            trueText={"balloon"}
            name={"typeToggle"}
          />
          {type ? (
            <div
              style={{
                position: "absolute",
                width: `100%`,
                height: `500px`,
                overflow: "hidden",
              }}
            >
              {posts.map((post, index) => {
                return (
                  <Balloon
                    key={post.postId}
                    position={index}
                    title={post.post.title}
                    clickPost={() => {
                      setPost(post.post);
                      setIsEdit(true);
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="row flex-left child-borders">
              {posts.map((post) => {
                return (
                  <Board
                    key={post.postId}
                    title={post.post.title}
                    content={post.post.content}
                    clickPost={() => {
                      setPost(post.post);
                      setIsEdit(true);
                    }}
                  />
                );
              })}
            </div>
          )}

          {isEdit && (
            <FormDialog
              uId={user.uid}
              defaultContent={post.content}
              defaultTitle={post.title}
              postId={post.postId}
              created={post.created}
              closeHandler={handleClose}
              isAdmin={isAdmin}
              status={post.status}
            />
          )}

          {isAdd && <FileModal uid={user.uid} onClose={handleAddClose} />}
        </div>
      ) : (
        <>
          <h3>로그인이 필요한 페이지 입니다.</h3>
          <button onClick={handleLogin}>로그인하기</button>
        </>
      )}
    </Layout>
  );
};

export default Todo;
