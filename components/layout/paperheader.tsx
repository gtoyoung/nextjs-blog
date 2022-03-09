import React, { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import AuthService from "services/firebase/auth";
import { GoogleUser } from "services/google.types";

export const CustomHeader = () => {
  const [user, setUser] = useState(null as GoogleUser);
  const [isAdmin, setIsAdmin] = useState(false);
  const authService = new AuthService();

  useEffect(() => {
    onAuthStateChanged(authService.auth(), (gUser) => {
      if (gUser) {
        setUser(gUser);

        gUser.getIdTokenResult().then((result) => {
          if (result.claims.admin) {
            setIsAdmin(true);
          }
        });
      }
    });
  }, []);

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      authService.logout().then(() => {
        alert("로그아웃 되었습니다.");
        window.location.href = "/";
      });
    }
  };

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
            {user && (
              <li>
                {user.displayName}님 환영합니다.
                <a href="#javascript" onClick={handleLogout}>
                  logout
                </a>
              </li>
            )}
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
              <Link href="/todo">
                <a>Todo</a>
              </Link>
            </li>
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
