import { Layout } from "components/layout";
import { Switch } from "@material-ui/core";
import { GoogleApi } from "services/google";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { notificationState, tokenState } from "components/state/atom";
import React, { useEffect } from "react";
const Index = () => {
  const token = useRecoilValue(tokenState);
  const notification = useRecoilValue(notificationState);
  const toggleHandler = useSetRecoilState(notificationState);
  const googleApi = new GoogleApi();

  // 우선 임시방편
  useEffect(() => {
    googleApi.getToken(token).then((data) => {
      toggleHandler(data.notification);
    });
  }, []);

  const toggle = () => {
    googleApi.updateToken(token, !notification).then(() => {
      toggleHandler(!notification);
    });
  };
  return (
    <Layout>
      <div className="row">
        <div className="col-12">
          <h1>Home Page</h1>
          <div className="paper container margin-bottom-large">
            <h4>Dovb`s Blog Notice</h4>
            <label>
              <Switch onChange={toggle} checked={notification} />
            </label>
            <p>블로그 개편 진행중</p>
            <p>
              기존 Gatsby + Contentful로 구성되어있던 블로그를 Nextjs +
              Contentful로 개편을 진행중입니다.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
