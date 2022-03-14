import React, { useEffect, useState } from "react";
import Link from "next/link";
import AuthService from "services/firebase/auth";
import { useAuth } from "services/authprovider";
import useTheme from "hook/useTheme";
import { getRedirectResult } from "firebase/auth";
import FbDatabase from "services/firebase/database";

const authService = new AuthService();
const db = new FbDatabase(false);

export const CustomHeader = () => {
  // const [user, setUser] = useState(null as GoogleUser);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  const [theme, themeToggler] = useTheme();

  useEffect(() => {
    var root = document.getElementsByTagName("html")[0];
    if (theme === "light" && typeof window !== "undefined") {
      root.classList.remove("dark");
      document.body.style.backgroundColor = "#fff";
      document.getElementById("themeChanger").textContent = "🌙";
    } else {
      root.classList.add("dark");
      document.body.style.background = "#41403e";
      document.getElementById("themeChanger").textContent = "🌞";
    }

    var token = localStorage.getItem("token");
    // 로그인 직후만 동작하는 토큰 저장 함수
    getRedirectResult(authService.auth()).then((result) => {
      if (result && result.user) {
        db.writeToken(result.user.uid, token);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      user.getIdTokenResult().then((result) => {
        if (result.claims.admin) {
          setIsAdmin(true);
        }
      });
    }
  }, [user]);

  return (
    <nav className="border split-nav">
      <div className="nav-brand">
        <h3>
          <a href="#">Dovb`s Blog</a>
        </h3>
      </div>
      <div className="collapsible">
        <input id="collapsible1" type="checkbox" name="collapsible1" />
        <label htmlFor="collapsible1" style={{}}>
          <h4>Menu</h4>
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </label>
        <input type="text" placeholder="Nice input" id="paperInputs1" />
        <div className="collapsible-body">
          <ul className="inline">
            {user ? (
              <li>
                {user.displayName} (
                <a
                  style={{
                    fontSize: "0.7rem",
                    borderBottom: "none",
                    fontFamily: "fantasy",
                  }}
                  href="#javascript"
                  onClick={() => {
                    if (confirm("로그아웃 하시겠습니까?")) {
                      authService.logout().then(() => {
                        alert("로그아웃 되었습니다.");
                        window.location.href = "/";
                      });
                    }
                  }}
                >
                  LOGOUT
                </a>
                )
              </li>
            ) : (
              <li>
                <a
                  style={{
                    fontSize: "0.7rem",
                    borderBottom: "none",
                    fontFamily: "fantasy",
                  }}
                  href="#javascript"
                  onClick={() => {
                    if (confirm("로그인 하시겠습니까?")) {
                      authService.login("google");
                    }
                  }}
                >
                  LOGIN
                </a>
              </li>
            )}
            <li>
              <a href="#javascript" id="themeChanger" onClick={themeToggler}>
                테마변경
              </a>
            </li>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <a>Blog</a>
              </Link>
            </li>
            <li>
              <Link href="/space">
                <a>Space</a>
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link href="/todo">
                    <a>Todo</a>
                  </Link>
                </li>
                <li>
                  <Link href="/chat">
                    <a>Chat</a>
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link href="/experiment">
                <a>Exp</a>
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link href="/admin">
                  <a>Admin</a>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
