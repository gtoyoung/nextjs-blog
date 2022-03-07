import { AppContext } from "pages/_app";
import { useContext, useState } from "react";
import { GoogleApi } from "services/google";

export const useNotification = () => {
  const appContext = useContext(AppContext);
  const tokenApi = new GoogleApi();

  let notification = null;
  if (typeof window !== "undefined") {
    // 세션에 저장된 알림 설정 값을 가져온다.
    notification = localStorage.getItem("notification");

    // 세션에 저장된 알림 설정값이 없을 경우 초기값을 설정한다.
    if (notification === null) {
      notification = appContext.notification;
    }
  }

  const [noti, setNoti] = useState(notification);

  const setMode = (value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("notification", value);
    }

    tokenApi
      .updateToken(appContext.token, value)
      .then(() => {
        setNoti(value);
      })
      .catch(() => {
        alert("알림서버와 통신이 되지 않습니다.\n관리자에게 문의하세요.");
      });
  };

  const toggleMode = () => {
    noti ? setMode(false) : setMode(true);
  };

  return [noti, toggleMode];
};
