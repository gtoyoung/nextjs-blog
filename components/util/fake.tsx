import { notificationState, tokenState } from "components/state/atom";
import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";

export const FakeComponent = ({ token, notification }) => {
  const tokenHandler = useSetRecoilState(tokenState);
  const notiHandler = useSetRecoilState(notificationState);

  useEffect(() => {
    tokenHandler(token);
    notiHandler(notification);
  });

  return <></>;
};
