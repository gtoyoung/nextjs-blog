import { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "services/firebase/auth";

// 권한 서비스 객체 생성
const authService = new AuthService();

// Firebase User Context 생성
const AuthContext = createContext<{ user: User }>({
  user: null,
});

// 유저에대한 전역 관리를 위한 컨텍스트 컴포넌트
export function AuthProvider({ children }) {
  const [user, setUser] = useState<User>(null);
  useEffect(() => {
    return authService.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

// 유저에대한 컨텍스트 호출 함수
export const useAuth = () => {
  return useContext(AuthContext);
};
