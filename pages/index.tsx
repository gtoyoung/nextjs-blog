import { Layout } from "components/layout";
import { Switch } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Totoro } from "components/web3D/Totoro";
import FbDatabase from "services/firebase/database";
const Index = () => {
  const [token, setToken] = useState("");
  const [noti, setNoti] = useState(false);
  const db = new FbDatabase(false);
  // 우선 임시방편
  useEffect(() => {
    localStorage.getItem("token") && setToken(localStorage.getItem("token"));
    if (localStorage.getItem("noti") === "true") {
      setNoti(true);
    } else {
      setNoti(false);
    }
  }, []);

  const toggle = () => {
    db.updateToken(token, !noti)
      .then(() => {
        setNoti(!noti);
        localStorage.setItem("noti", !noti + "");
      })
      .catch((err) => {
        console.log(err);
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
              <Switch onChange={toggle} checked={noti} />
            </label>
            <p>블로그 개편 진행중</p>
            <p>
              기존 Gatsby + Contentful로 구성되어있던 블로그를 Nextjs +
              Contentful로 개편을 진행중입니다.
            </p>
            <Totoro />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
