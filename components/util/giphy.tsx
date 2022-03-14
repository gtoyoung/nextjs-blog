import { GiphyFetch } from "@giphy/js-fetch-api";
import * as reactComponents from "@giphy/react-components";
import _ from "lodash";
import React, { useState } from "react";
import ResizeObserver from "react-resize-observer";
import FbDatabase from "services/firebase/database";

const giphyFetch = new GiphyFetch(`${process.env.NEXT_PUBLIC_GIPHY_API_KEY}`);

const GiphyGrid = ({ uid, customClick }) => {
  const fetchGifs = (offset: number) =>
    giphyFetch.trending({ offset, limit: 10 });
  const [width, setWidth] = useState(window.innerWidth);
  const [search, setSearch] = useState("");

  //검색창 debounce 처리

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

  const callbackCustom = (gif: any, e) => {
    e.preventDefault();
    customClick("https://i.giphy.com/media/" + gif.id + "/giphy.gif");
  };

  const debounceSerach = _.debounce((search) => {
    setSearch(search);
  }, 1000);

  const onDebounceChange = (e) => {
    const search = e.target.value;
    debounceSerach(search);
  };

  return (
    <>
      <div className="form-group">
        <input
          type="text"
          placeholder="검색어를 입력하세요."
          id="searchInput"
          onChange={onDebounceChange}
        />
      </div>
      <reactComponents.Grid
        key={search}
        onGifClick={customClick ? callbackCustom : gifClickhandler}
        fetchGifs={
          search === ""
            ? fetchGifs
            : (offset: number) =>
                giphyFetch.search(search, { offset, limit: 10 })
        }
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
