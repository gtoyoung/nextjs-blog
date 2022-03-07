import { atom } from "recoil";

export const tokenState = atom({
  key: "tokenState",
  default: "",
});

export const notificationState = atom({
  key: "notificationState",
  default: false,
});
