import axios, { AxiosInstance } from "axios";

export class PapagoApi {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_PROXY_SERVER,
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  async translate(text: string): Promise<string> {
    return await this.client
      .post("/api/translate", {
        query: text,
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data.message.result.translatedText;
        }
        return "";
      });
  }

  async translateKakao(text: string): Promise<string> {
    return await this.client
      .post("/api/kakaoi", {
        text: text,
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data.result;
        }
        return "";
      });
  }
}
