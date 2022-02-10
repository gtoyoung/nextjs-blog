import React, { Component } from "react";
import { Layout } from "components/layout";

export default class Index extends Component {
  render() {
    return (
      <Layout>
        <div className="row">
          <div className="col-12">
            <h1>Home Page</h1>
            <div className="paper container margin-bottom-large">
              <h4>Dovb`s Blog Notice</h4>
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
  }
}
