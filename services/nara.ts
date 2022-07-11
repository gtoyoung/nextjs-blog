import axios, { AxiosInstance } from "axios";
import { Hospital } from "../type/nara.types";
// import XMLParser from "react-xml-parser";

const apiKey = process.env.NEXT_PUBLIC_NARA_APIKEY;

export class NaraApi {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `http://apis.data.go.kr/B551182/rprtHospService`,
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  convertHospital = (hospital): Hospital => {
    const rawHospital = hospital;
    console.log(hospital.telno);
    return {
      yadmNm: rawHospital.yadmNm,
      sidoNm: rawHospital.sidoCdNm,
      sgguNm: rawHospital.sgguCdNm,
      recuClCd: rawHospital.recuClCd,
      addr: rawHospital.addr,
      telno: rawHospital.telno,
      mgtStaDd: rawHospital.mgtStaDd,
      XPosWgs84: rawHospital.XPosWgs84,
      YPosWgs84: rawHospital.YPosWgs84,
      pcrPsblYn: rawHospital.pcrPsblYn,
      ratPsblYn: rawHospital.ratPsblYn,
    };
  };

  async getHospitals(rownum: number, page: number): Promise<Array<Hospital>> {
    return await this.client
      .get(
        `/getRprtHospService?serviceKey=${apiKey}&numOfRows=${rownum}&pageNo=${page}`
      )
      .then((res) => {
        if (res.status === 200) {
          const hospitals = new Array<Hospital>();
          res.data.response.body.items.item.map((hostipal) => {
            const convert = this.convertHospital(hostipal);
            hospitals.push(convert);
          });
          return hospitals;
        }
        return [];
      });
  }
}
