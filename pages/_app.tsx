import Router from "next/router";
import NProgress from "nprogress";
import { DefaultSeo } from "next-seo";
import "papercss/dist/paper.min.css";
import { createContext, useEffect, useState } from "react";
import useTheme from "hook/useTheme";
import * as ga from "../services/ga";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { GoogleApi } from "services/google";
import { useNotification } from "hook/useNotification";

export const AppContext = createContext("");

const DEFAULT_SEO = {
  title: "Dovb`s Blog",
  description: "개발 공부 중",
  openGraph: {
    type: "website",
    locale: "en",
    title: "Dovb`s Blog",
    description: "개발 공부 중",
    site_name: "Dovb`s Blog",
  },
};

/*
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FB_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDERID,
  appId: process.env.NEXT_PUBLIC_FB_APPID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREID,
};*/

const firebaseConfig = {
  apiKey: "AIzaSyDYq7pxlORqd7Pi7ruHzZEmn8yOWAGThZM",
  authDomain: "dovb-blog.firebaseapp.com",
  projectId: "dovb-blog",
  storageBucket: "dovb-blog.appspot.com",
  messagingSenderId: "487590574701",
  appId: "1:487590574701:web:69f4df7f78b5bf9ad31d64",
  measurementId: "G-G7XTBGWJ9C",
};

const CustomApp = ({ Component, pageProps }) => {
  const [theme, themeToggler] = useTheme();
  const [token, setToken] = useState("");
  // 구글 firebase 초기화
  useEffect(() => {
    initializeApp(firebaseConfig);
    const googleApi = new GoogleApi();
    const messaging = getMessaging();

    getToken(messaging, {
      vapidKey:
        "BCMn72joP8jU9cKNSTRJ3IB4VYYFDVpDn_FGEe10jfxLA1SBtz91lTL6vDjiA9A7rJYHinrxKaRpMpFz44VtEu4",
    })
      .then((currentToken) => {
        if (currentToken) {
          // 토큰 저장
          googleApi
            .insertToken(currentToken)
            .then((res) => {
              setToken(currentToken);
              // 알림 토클 설정
              if (currentToken !== res._id)
                useNotification(res.notification, currentToken);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          // Show permission request UI
          console.log(
            "No registration token available. Request permission to generate one."
          );
          // ...
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        // ...
      });
  }, []);

  useEffect(() => {
    var root = document.getElementsByTagName("html")[0];
    if (theme === "light" && typeof window !== "undefined") {
      root.classList.remove("dark");
      document.body.style.backgroundColor = "#fff";
      document.getElementById("themeBtn").setAttribute("aria-pressed", "false");
    } else {
      root.classList.add("dark");
      document.body.style.background = "#41403e";
      document.getElementById("themeBtn").setAttribute("aria-pressed", "true");
    }

    Router.events.on("routeChangeComplete", () => {
      NProgress.start();
    });
    Router.events.on("routeChangeComplete", () => {
      NProgress.done();
    });
    Router.events.on("routeChangeError", () => {
      NProgress.done();
    });
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };

    Router.events.on("routeChangeComplete", handleRouteChange);
    Router.events.off("routeChangeComplete", handleRouteChange);
  }, [Router.events]);
  return (
    <>
      <AppContext.Provider value={token}>
        <DefaultSeo {...DEFAULT_SEO} />
        <Component {...pageProps} />
        <button
          id="themeBtn"
          className="btn_theme"
          onClick={themeToggler}
        ></button>
      </AppContext.Provider>
    </>
  );
};

export default CustomApp;
