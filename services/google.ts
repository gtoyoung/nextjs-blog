import axios, { AxiosInstance } from "axios";
import { FcmToken, GoogleUser } from "../type/google.types";

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

  convertUser = (user): GoogleUser => {
    const rawUser = user;
    return {
      uid: rawUser.uid,
      displayName: rawUser.displayName,
      email: rawUser.email,
      photoURL: rawUser.photoURL,
      emailVerified: rawUser.emailVerified,
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

  async getToken(token: string): Promise<FcmToken> {
    return await this.client
      .post("/api/google/get", {
        token: token,
      })
      .then((res) => {
        if (res.status === 200) {
          const convert = this.convertFcmToken(res.data);
          return convert;
        }
        return null;
      });
  }

  async getUsers(uid: string): Promise<GoogleUser[]> {
    return await this.client
      .post("/api/google/getUsers", {
        uid: uid,
      })
      .then((res) => {
        const results = new Array<GoogleUser>();
        if (res.status === 200) {
          res.data.map((user) => {
            results.push(this.convertUser(user));
          });
          return results;
        }
        return [];
      });
  }

  async getUserInfo(uid: string): Promise<GoogleUser> {
    return await this.client
      .post("/api/google/getUserInfo", {
        uid: uid,
      })
      .then((res) => {
        if (res.status === 200) {
          const convert = this.convertUser(res.data);
          return convert;
        }
        return null;
      });
  }

  async pushMsg(tokens: string[], msg: string): Promise<boolean> {
    return await this.client
      .post("/api/google/pushForUser", {
        tokens: tokens,
        msg: msg,
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
        return false;
      });
  }

  async pushMsgSchedule(): Promise<boolean> {
    return await this.client.get("/api/google/pushMsg").then(()=>{
      return true;
    }).catch(()=>{
      return false;
    })
  }
}
