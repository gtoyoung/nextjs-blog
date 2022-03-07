import { Layout } from "components/layout";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import AuthService from "services/auth";
import { GoogleUser } from "services/google.types";

const Todo = () => {
  const [user, setUser] = useState(null as GoogleUser);
  const authService = new AuthService();
  useEffect(() => {
    onAuthStateChanged(authService.auth(), (user) => {
      if (!user) {
        alert("로그인이 필요한 페이지 입니다.");
        authService.login("google");
      } else {
        // 로그인된 유저 정보 셋팅
        setUser(authService.getProfile(user));
      }
    });
  });

  return (
    <Layout>
      {user ? (
        <div>
          <h1>{user.displayName}</h1>
          <img src={user.photoURL} alt={user.displayName} />
        </div>
      ) : (
        <h4>임시페이지</h4>
      )}
    </Layout>
  );
};

export default Todo;
