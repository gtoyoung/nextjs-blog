import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import "./style.css";
import FbStorage from "services/firebase/storage";
import FbDatabase from "services/firebase/database";
import { CircularProgress } from "@material-ui/core";

const ImgList = ({ items, uid }: { items: any[]; uid: string }) => {
  const storage = new FbStorage();
  const db = new FbDatabase(false);

  return (
    <>
      {items && items.length > 0 ? (
        <ImageList
          sx={{
            height: 300,
            WebkitOverflowScrolling: "touch",
          }}
          cols={3}
          rowHeight={180}
          className="imageListDiv"
        >
          {items.map((item, index) => (
            <ImageListItem key={index} id={item.fileName}>
              {item.status === "loading" && (
                <div id={"myImg_" + index}>
                  <CircularProgress color="secondary" />
                </div>
              )}
              <img
                src={item.url}
                id={item.fileName}
                className={item.fileName}
                loading="lazy"
                onLoad={() => {
                  item.status = "loaded";
                  document
                    .getElementById("myImg_" + index)
                    .setAttribute("style", "display:none");
                }}
                onClick={() => {
                  if (confirm("프로필 사진을 변경하시겠습니까?"))
                    db.saveProfileImg(uid, item.url)
                      .then(() => {
                        alert("변경하였습니다.");
                      })
                      .catch(() => {
                        alert("변경에 실패하였습니다.");
                      });
                }}
              />
              <div
                className="close"
                onClick={() => {
                  if (confirm("삭제하시겠습니까?")) {
                    storage.deleteFile(uid, item.fileName).then(() => {
                      // 이미지를 다시 조회하지 않도록 요소 바로 제거
                      document.getElementById(item.fileName).remove();
                    });
                  }
                }}
              ></div>
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <>
          <div className="imgLoadingDiv">
            <h4>Loading....</h4>
          </div>
        </>
      )}
    </>
  );
};

export default ImgList;
