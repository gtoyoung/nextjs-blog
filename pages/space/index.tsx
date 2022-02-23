import React from "react";
import { Layout } from "components/layout";
import { NasaApi } from "services/nasa";
import { GetStaticProps } from "next";
import NasaGallery from "components/nasa/gallery";

export const getStaticProps: GetStaticProps = async () => {
  const api = new NasaApi();
  const viewCnt: number = 50;
  const reulst = await api.getNasaPicture(viewCnt);
  const nasa = JSON.stringify(reulst);
  return {
    props: {
      nasa,
    },
  };
};

const Space = ({ nasa }) => {
  const jsonConvert = JSON.parse(nasa);
  return (
    <Layout>
      <NasaGallery pictures={jsonConvert} />
    </Layout>
  );
};

export default Space;
