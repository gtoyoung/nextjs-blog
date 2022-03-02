import axios, { AxiosInstance } from "axios";

export class GoogleApi {
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

  async insertToken(text: string): Promise<boolean> {
    return await this.client
      .post("/api/google/insertToken", {
        token: text,
      })
      .then((res) => {
        if (res.status === 200) {
          return true;
        }
        return false;
      });
  }
}
