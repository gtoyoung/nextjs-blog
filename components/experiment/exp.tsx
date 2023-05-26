import React from "react";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import "./style.css";

const Experiment = () => {
  return (
    <div className="row flex-spaces tabs">
      <input id="tab1" type="radio" name="tabs" checked />
      <label htmlFor="tab1">Developing</label>

      <input id="tab2" type="radio" name="tabs" />
      <label htmlFor="tab2">Waiting</label>

      <div className="content" id="content1">
        <ol>
          {/* <li>
            공공데이터포털에서 제공되는 API로 지도위에 코로나 검사 가능 병원
            정보 표시 Devel 중
            <ol>
              <LinkPreview
                url="https://dovb.vercel.app/map"
                backgroundColor="black"
                primaryTextColor="white"
                secondaryTextColor="#ccc"
                borderColor="black"
                width="40vw"
                margin="30px auto"
                openInNewTab={false}
              />
            </ol>
          </li> */}
          <li>
            <ol>
              <a href="/trees">나무 생성기 - velog 참조</a>
            </ol>
          </li>
          <li>
            <ol>
              <a href="/task">Task 개발 페이지</a>
            </ol>
          </li>
          <li>
            <ol>
              <a href="/omok">오목 게임</a>
            </ol>
          </li>
        </ol>
      </div>
      <div className="content" id="content2">
        <p>nothing...</p>
      </div>
    </div>
  );
};

export default Experiment;
