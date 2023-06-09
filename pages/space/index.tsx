import React from "react";
import { Layout } from "components/layout";
// import { NasaApi } from "services/nasa";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
  // const api = new NasaApi();
  // const viewCnt: number = 10;
  // const reulst = await api.getNasaPicture(viewCnt);
  const nasa = JSON.stringify({});
  return {
    props: {
      nasa,
    },
  };
};

const Space = ({}) => {
  // const jsonConvert = JSON.parse(nasa);
  // return <Layout>{nasa ? <NasaGallery key={"t"} pictures={jsonConvert} /> : <div>Loading...</div>}</Layout>;
  return <Layout>{<>API 문제 발생으로 인한 잠정 중단</>}</Layout>;
};

export default Space;
