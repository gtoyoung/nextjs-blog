import UserSelectBox from "components/admin/selectbox";
import { Layout } from "components/layout";
import { Board } from "components/todo/board";
import FormDialog from "components/todo/dialog";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import AuthService from "services/firebase/auth";
import FbDatabase from "services/firebase/database";
import { GoogleApi } from "services/google";
import { GoogleUser, Post, PostDetail } from "services/google.types";

// 관리자만 접근할수있는 페이지
const AdminPage = () => {
  const [user, setUser] = useState(null as GoogleUser);
  const [userList, setUserList] = useState([] as GoogleUser[]);
  const [selectUser, setSelectUser] = useState(null as GoogleUser);
  const [posts, setPosts] = useState([] as Post[]);
  const [post, setPost] = useState({
    uid: "",
    post: null as PostDetail,
  });
  const [isEdit, setIsEdit] = useState(false);
  const db = new FbDatabase(true);
  const authService = new AuthService();
  const googleApi = new GoogleApi();
  useEffect(() => {
    onAuthStateChanged(authService.auth(), (gUser) => {
      if (gUser) {
        // setUser(gUser);

        gUser.getIdTokenResult().then((result) => {
          // 관리자가 아닌 계정은 홈으로 이동
          if (result.claims.admin) {
            setUser(gUser);
            googleApi
              .getUsers(gUser.uid)
              .then((result) => {
                setUserList(result);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            window.location.href = "/";
          }
        });
      }
    });
  }, []);

  const changeUser = (user: GoogleUser) => {
    if (user) {
      setSelectUser(user);
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
  };

  const handleClose = () => {
    setIsEdit(false);

    // 수정작업을 진행한 후에 post 정보 갱신을 위한 추가
    changeUser(selectUser);
  };

  return (
    <Layout>
      {user && (
        <div>
          <h4>{user.displayName}관리자 페이지 입니다.</h4>
          <UserSelectBox users={userList} changeUser={changeUser} />
          <br />
          <div>
            {posts.map((post) => {
              return (
                <Board
                  key={post.postId}
                  title={post.post.title}
                  content={post.post.content}
                  clickPost={() => {
                    setPost({
                      uid: selectUser.uid,
                      post: post.post,
                    });
                    setIsEdit(true);
                  }}
                  status={post.post.status}
                />
              );
            })}
          </div>
          {isEdit && (
            <FormDialog
              uId={post.uid}
              defaultContent={post.post.content}
              defaultTitle={post.post.title}
              postId={post.post.postId}
              created={post.post.created}
              closeHandler={handleClose}
              isAdmin={true}
              status={post.post.status}
            />
          )}
        </div>
      )}
    </Layout>
  );
};

export default AdminPage;
