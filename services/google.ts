import axios, { AxiosInstance } from "axios";
import { FcmToken } from "./google.types";

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

  convertFcmToken = (fcmToken): FcmToken => {
    const rawFcmToken = fcmToken;
    return {
      token: rawFcmToken.token,
      notification: rawFcmToken.notification,
      _id: rawFcmToken._id,
    };
  };

  async insertToken(text: string): Promise<FcmToken> {
    return await this.client
      .post("/api/google/insertToken", {
        token: text,
      })
      .then((res) => {
        if (res.status === 200) {
          const convert = this.convertFcmToken(res.data);
          return convert;
        }
        return null;
      });
  }

  async updateToken(token: string, notification: boolean): Promise<boolean> {
    return await this.client
      .post("/api/google/updateToken", {
        token: token,
        notification: notification,
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
        return false;
      });
  }
}
