import { Layout } from "components/layout";
import React, { Component } from "react";
import { ContentApi, PhotoPost } from "services";

type PhotoPageProps = {
  entries: Array<PhotoPost>;
};

export default class PhotoPage extends Component<PhotoPageProps> {
  static async getInitialProps() {
    const api = new ContentApi();
    const entries = await api.fetchPhotoEntries();
    return { entries };
  }

  renderPhotoList = (entries) => {
    entries.map((entry, i) => {
      return <div></div>;
    });
  };

  render() {
    const { entries } = this.props;
    return (
      <Layout>
        <h1>Photo</h1>
        <div>
          {entries.map((entry, i) => {
            return (
              <div className="row flex-center child-borders">
                <div style={{ width: "10rem" }}>
                  <img
                    src={entry.photo.url}
                    style={{ height: "auto", width: "auto" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Layout>
    );
  }
}
