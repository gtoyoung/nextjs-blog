import { Layout } from "components/layout";
// import { HospitalBox } from "components/map";
// import Map from "components/map/map";
// import useCurrentLocation from "hook/useCurrentLocation";
// import { GetStaticProps } from "next";
import React from "react";
// import { NaraApi } from "services/nara";
// import { Hospital } from "services/nara.types";

// export const getStaticProps: GetStaticProps = async () => {
//   const api = new NaraApi();
//   const num: number = 10;
//   const page: number = 1;
//   const result = await api.getHospitals(num, page);
//   const hospitals = JSON.stringify(result);
//   return {
//     props: {
//       hospitals,
//     },
//   };
// };

const MapPage = () => {
  // const { location } = useCurrentLocation();
  // const { latitude, longitude } = location;
  // const [hospital, setHospital] = useState<Hospital>();
  // const findHospital = (hospitalInfo) => {
  //   setHospital(hospitalInfo);
  // };

  // const jsonConvert = JSON.parse(hospitals);
  return (
    <Layout>
      <h2>수정중</h2>
      {/* <Map latitude={latitude} longitude={longitude} hospitalInfo={hospital} />
      <HospitalBox hospitals={jsonConvert} findHospital={findHospital} /> */}
    </Layout>
  );
};

export default MapPage;
