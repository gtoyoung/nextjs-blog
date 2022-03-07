import { Layout } from "components/layout";
import { Balloon } from "components/todo";
import FormDialog from "components/todo/dialog";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import AuthService from "services/auth";
import FbDatabase from "services/database";
import { GoogleUser, Post } from "services/google.types";

const Todo = () => {
  const [user, setUser] = useState(null as GoogleUser);
  const [post, setPost] = useState(null as Post);
  const [posts, setPosts] = useState([] as Post[]);
  const [isEdit, setIsEdit] = useState(false);

  const authService = new AuthService();

  useEffect(() => {
    onAuthStateChanged(authService.auth(), (user) => {
      if (!user) {
        if (confirm("로그인이 필요한 페이지 입니다.\n로그인하시겠습니까?"))
          authService.login("google");
      } else {
        // 로그인된 유저 정보 셋팅
        setUser(authService.getProfile(user));

        // 추후 관리자일 경우에는 모든 포스트를 다 볼수 있도록 설정
        user.getIdTokenResult().then((result) => {
          if (result.claims.admin) {
          } else {
          }
        });

        const db = new FbDatabase();
        db.getPosts(user.uid)
          .then((result) => {
            const userPost = [] as Post[];
            result.forEach((post) => {
              userPost.push(post);
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

  return (
    <Layout>
      {user ? (
        <div>
          <div style={{ display: "flex", marginTop: "10px" }}>
            <img src={user.photoURL} />
            <h3 style={{ margin: "20px" }}>
              {user.displayName} 님 환영합니다!
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
            />
          </div>
          <div
            style={{
              position: "absolute",
              width: `100%`,
              height: `500px`,
              overflow: "hidden",
            }}
          >
            {posts.map((post) => {
              return (
                <Balloon
                  position={post.postId}
                  title={post.title}
                  clickPost={() => {
                    setPost(post);
                    setIsEdit(true);
                  }}
                />
              );
            })}
          </div>
          {isEdit && (
            <FormDialog
              uId={user.uid}
              defaultContent={post.content}
              defaultTitle={post.title}
              postId={post.postId}
              created={post.created}
              closeHandler={handleClose}
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
