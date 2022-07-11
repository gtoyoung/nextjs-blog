import axios, { AxiosInstance } from "axios";
import { PoketInfo } from "../type/poke.types";

export class PokeApi {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_POKE_SERVER,
    });
  }

  convertPoketInfo = (poketInfo): PoketInfo => {
    const rawPoketInfo = poketInfo;
    return {
      id: rawPoketInfo.id,
      name: rawPoketInfo.name,
      height: rawPoketInfo.height,
      weight: rawPoketInfo.weight,
      types: rawPoketInfo.types,
      img: {
        back: rawPoketInfo.img.back,
        front: rawPoketInfo.img.front,
        artwork: rawPoketInfo.img.artwork,
        dream: rawPoketInfo.img.dream,
        home: rawPoketInfo.img.home,
      },
      color: rawPoketInfo.color,
    };
  };

  // 포켓몬 상세
  async getPoketInfo(name: string): Promise<PoketInfo> {
    return await this.client
      .post("/info", {
        name: name,
      })
      .then((res) => {
        if (res.status === 200) {
          const convert = this.convertPoketInfo(res.data);
          return convert;
        }
        return null;
      })
      .catch(() => {
        return null;
      });
  }

  // 포켓몬 리스트
  async getPoketList(offset: number, limit: number): Promise<Array<PoketInfo>> {
    return await this.client
      .post("/list", {
        offset: offset,
        limit: limit,
      })
      .then((res) => {
        const results = new Array<PoketInfo>();
        if (res.status === 200) {
          res.data.map((poketInfo) => {
            results.push(this.convertPoketInfo(poketInfo));
          });
          return results;
        }
        return [];
      })
      .catch(() => {
        return [];
      });
  }
}
