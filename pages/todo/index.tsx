import { Layout } from "components/layout";
import { Balloon } from "components/todo";
import FormDialog from "components/todo/dialog";
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import AuthService from "services/auth";
import FbDatabase from "services/database";
import { GoogleUser, Post, PostDetail } from "services/google.types";
import { Board } from "components/todo/board";
import { StorageToggle } from "components/util/storagetoggle";

const Todo = () => {
  const [user, setUser] = useState(null as GoogleUser);
  const [post, setPost] = useState(null as PostDetail);
  const [posts, setPosts] = useState([] as Post[]);
  const [isEdit, setIsEdit] = useState(false);
  const [type, setType] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
        setUser(authService.getProfile(user));

        user.getIdTokenResult().then((result) => {
          if (result.claims.admin) {
            db = new FbDatabase(true);
            setIsAdmin(true);
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

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      authService.logout().then(() => {
        alert("로그아웃 되었습니다.");
        setUser(null);
        setPosts([]);
      });
    }
  };

  const handleLogin = () => {
    authService.login("google");
  };

  const handleClose = () => {
    setIsEdit(false);
  };

  const showToggle = () => {
    setType(!type);
  };

  return (
    <Layout>
      {user ? (
        <div>
          <div style={{ display: "flex", marginTop: "10px" }}>
            <img src={user.photoURL} onClick={handleLogout} />
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
            <>
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
            </>
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
