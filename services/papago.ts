import axios, { AxiosInstance } from "axios";

const clientId = process.env.NEXT_PUBLIC_PAPAGO_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_PAPAGO_CLIENT_SECRET;
const proxyUrl = process.env.NEXT_PUBLIC_PROXY_SERVER;

export class PapagoApi {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "",
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
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
}
