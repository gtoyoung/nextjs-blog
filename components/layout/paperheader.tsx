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
      document.getElementById("themeChanger").textContent = "π";
    } else {
      root.classList.add("dark");
      document.body.style.background = "#41403e";
      document.getElementById("themeChanger").textContent = "π";
    }

    var token = localStorage.getItem("token");
    // λ‘κ·ΈμΈ μ§νλ§ λμνλ ν ν° μ μ₯ ν¨μ
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
                    if (confirm("λ‘κ·Έμμ νμκ² μ΅λκΉ?")) {
                      authService.logout().then(() => {
                        alert("λ‘κ·Έμμ λμμ΅λλ€.");
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
                    if (confirm("λ‘κ·ΈμΈ νμκ² μ΅λκΉ?")) {
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
                νλ§λ³κ²½
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
            <li>
              <Link href="/poke">
                <a>Pokemon</a>
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
