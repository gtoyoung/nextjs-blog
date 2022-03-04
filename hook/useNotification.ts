import { GoogleApi } from "services/google";

export const useNotification = (notification: boolean, token: string) => {
  var toggle = document.getElementsByClassName("switch-label")[0];
  var ball = document.getElementsByClassName("ball")[0];

  const tokenApi = new GoogleApi();
  tokenApi
    .updateToken(token, notification)
    .then((res) => {
      if (res) {
        // 알림이 설정되어있을 경우
        if (notification) {
          toggle.setAttribute("style", "background-color: black");
          ball.setAttribute("style", "left: 5px; background-color: aquamarine");
          ball.setAttribute("data-ball", "on");
        } // 알림이 설정되어있지 않은 경우
        else {
          toggle.setAttribute("style", "background-color: white");
          ball.setAttribute("style", "left: -20px; background-color: red");
          ball.removeAttribute("data-ball");
        }
      }
    })
    .catch(() => {
      alert("알림서버와 통신이 되지 않습니다.\n관리자에게 문의하세요.");
    });

  return [notification];
};
