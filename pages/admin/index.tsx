import { Layout } from "components/layout";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import AuthService from "services/auth";

const AdminPage = () => {
  const [user, setUser] = useState(null as User);
  const authService = new AuthService();

  useEffect(() => {
    onAuthStateChanged(authService.auth(), (gUser) => {
      if (gUser) {
        // setUser(gUser);

        gUser.getIdTokenResult().then((result) => {
          // 관리자가 아닌 계정은 홈으로 이동
          if (result.claims.admin) {
            setUser(gUser);
          } else {
            window.location.href = "/";
          }
        });
      }
    });
  }, []);

  return (
    <Layout>
      <h4>{user.displayName}`s 관리자 페이지 입니다.</h4>
    </Layout>
  );
};

export default AdminPage;
