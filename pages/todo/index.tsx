import { Layout } from "components/layout";
import { Balloon } from "components/todo";
import FormDialog from "components/todo/dialog";
import { getRedirectResult } from "firebase/auth";
import React, { useEffect, useState } from "react";
import AuthService from "services/firebase/auth";
import FbDatabase from "services/firebase/database";
import { Post, PostDetail } from "services/google.types";
import { Board } from "components/todo/board";
import { StorageToggle } from "components/util/storagetoggle";
import FileModal from "components/util/filemodal";
import { Box, CircularProgress, Stack } from "@mui/material";
import { useAuth } from "services/authprovider";
import Pagination from "@mui/material/Pagination";
import usePagination from "services/pagination";
import "./style.css";
import { onValue } from "firebase/database";

const Todo = () => {
  const { user } = useAuth();
  const [post, setPost] = useState(null as PostDetail);
  const [posts, setPosts] = useState([] as Post[]);
  const [isEdit, setIsEdit] = useState(false);
  const [type, setType] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [profile, setProfile] = useState("");
  const [count, setCount] = useState(0);
  const authService = new AuthService();
  let db = new FbDatabase(isAdmin);

  // 페이지 상태
  let [page, setPage] = useState(1);
  // 한페이지당 보여지는 게시물 수
  const PER_PAGE = 4;

  const _DATA = usePagination(posts, PER_PAGE);

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
    if (user) {
      user.getIdTokenResult().then((result) => {
        if (result.claims.admin) {
          db = new FbDatabase(true);
          setIsAdmin(true);
        }
      });

      // 프로필 이미지 변경사항 실시간 감시
      var profileRef = db.getRef("/users/" + user.uid + "/profileImg");
      onValue(profileRef, () => {
        db.getProfileImg(user.uid).then((result) => {
          if (result === "") {
            setProfile(user.photoURL);
          } else {
            setProfile(result);
          }
        });
      });

      // 요구사항 변경사항 실시간 감시
      var postRef = db.getRef("/users/" + user.uid + "/posts");
      onValue(postRef, () => {
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
      });
    }
  }, [user]);

  useEffect(() => {
    setCount(Math.ceil(posts.length / PER_PAGE));
  }, [posts]);

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
                  onClick={() => {
                    setIsAdd(true);
                  }}
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
              postId={null}
              closeHandler={() => {
                setIsEdit(false);
              }}
              isAdmin={isAdmin}
              status={""}
            />
          </div>
          <StorageToggle
            toggle={() => {
              setType(!type);
            }}
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
            <Box p="5">
              <div className="row flex-left child-borders">
                {_DATA.currentData().map((post) => {
                  return (
                    <Board
                      key={post.postId}
                      title={post.post.title}
                      content={post.post.content}
                      clickPost={() => {
                        setPost(post.post);
                        setIsEdit(true);
                      }}
                      status={post.post.status}
                    />
                  );
                })}
              </div>
              <Stack spacing={2}>
                <Pagination
                  count={count}
                  size="large"
                  page={page}
                  shape="rounded"
                  onChange={(_e, p) => {
                    setPage(p);
                    _DATA.jump(p);
                  }}
                  color="secondary"
                />
              </Stack>
            </Box>
          )}

          {isEdit && (
            <FormDialog
              uId={user.uid}
              defaultContent={post.content}
              defaultTitle={post.title}
              postId={post.postId}
              closeHandler={() => {
                setIsEdit(false);
              }}
              isAdmin={isAdmin}
              status={post.status}
            />
          )}

          {isAdd && (
            <FileModal
              uid={user.uid}
              onClose={() => {
                setIsAdd(false);
              }}
              customClick={null}
            />
          )}
        </div>
      ) : (
        <>
          <h3>로그인이 필요한 페이지 입니다.</h3>
        </>
      )}
    </Layout>
  );
};

export default Todo;
