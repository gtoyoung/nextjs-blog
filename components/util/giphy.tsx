import { GiphyFetch } from "@giphy/js-fetch-api";
import * as reactComponents from "@giphy/react-components";
import React, { useState } from "react";
import ResizeObserver from "react-resize-observer";
import FbDatabase from "services/firebase/database";

const giphyFetch = new GiphyFetch(`${process.env.NEXT_PUBLIC_GIPHY_API_KEY}`);

const GiphyGrid = ({ uid }) => {
  const fetchGifs = (offset: number) =>
    giphyFetch.trending({ offset, limit: 10 });
  const [width, setWidth] = useState(window.innerWidth);
  const db = new FbDatabase(false);

  const gifClickhandler = (gif: any, e) => {
    e.preventDefault();
    if (confirm("프로필 사진을 변경하시겠습니까?")) {
      const imgUrl = "https://i.giphy.com/media/" + gif.id + "/giphy.gif";
      db.saveProfileImg(uid, imgUrl)
        .then(() => {
          alert("변경하였습니다.");
        })
        .catch(() => {
          alert("변경에 실패하였습니다.");
        });
    }
  };
  return (
    <>
      <reactComponents.Grid
        onGifClick={gifClickhandler}
        fetchGifs={fetchGifs}
        width={width}
        columns={3}
        gutter={6}
      />
      <ResizeObserver
        onResize={({ width }) => {
          setWidth(width);
        }}
      />
    </>
  );
};

export default GiphyGrid;
