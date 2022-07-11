import axios, { AxiosInstance } from "axios";
import { NasaPicture } from "../type/nasa.types";

const apiKey = process.env.NEXT_PUBLIC_NASA_APIKEY;

export class NasaApi {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `https://api.nasa.gov/planetary`,
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  convertNasaPicture = (nasaPicture): NasaPicture => {
    const rawNasaPicture = nasaPicture;
    return {
      copyright: rawNasaPicture.copyright,
      date: rawNasaPicture.date,
      explanation: rawNasaPicture.explanation,
      hdurl: rawNasaPicture.hdurl,
      media_type: rawNasaPicture.media_type,
      service_version: rawNasaPicture.service_version,
      title: rawNasaPicture.title,
      url: rawNasaPicture.url,
    };
  };

  async getNasaPicture(count: number): Promise<Array<NasaPicture>> {
    return await this.client
      .get(`/apod?api_key=${apiKey}&count=${count}&thumbs=true`)
      .then((res) => {
        if (res.status === 200) {
          const nasaPictures = new Array<NasaPicture>();
          res.data.map((nasaPicture) => {
            const convert = this.convertNasaPicture(nasaPicture);
            nasaPictures.push(convert);
          });
          return nasaPictures;
        }
        return [];
      });
  }
}
