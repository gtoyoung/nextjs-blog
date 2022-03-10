import Router from "next/router";
import NProgress from "nprogress";
import { DefaultSeo } from "next-seo";
import "papercss/dist/paper.min.css";
import { useEffect } from "react";
import * as ga from "../services/ga";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { GoogleApi } from "services/google";
import { AuthProvider } from "components/util/authprovider";

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
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASURE_ID,
};

const CustomApp = ({ Component, pageProps }) => {
  // 구글 firebase 초기화
  useEffect(() => {
    initializeApp(firebaseConfig);
    const googleApi = new GoogleApi();
    const messaging = getMessaging();

    getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FB_VAPID_KEY,
    })
      .then((currentToken) => {
        if (currentToken) {
          // 토큰 저장
          googleApi
            .insertToken(currentToken)
            .then((res) => {
              // 전역 상태값 업데이트
              localStorage.setItem("token", currentToken);
              localStorage.setItem("noti", res.notification + "");
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
      <DefaultSeo {...DEFAULT_SEO} />
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
};

export default CustomApp;
