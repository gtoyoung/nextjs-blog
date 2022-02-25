import axios, { AxiosInstance } from "axios";

export class PapagoApi {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `https://dovb-api.vercel.app`,
      method: "POST",
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
}
