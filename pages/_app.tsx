import Router from "next/router";
import NProgress from "nprogress";
import { DefaultSeo } from "next-seo";
import "papercss/dist/paper.min.css";
import { useEffect } from "react";
import * as ga from "../services/ga";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { AuthProvider } from "services/authprovider";
import FbDatabase from "services/firebase/database";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../static/styles/style.css"

const DEFAULT_SEO = {
  title: "Dovb`s Blog",
  description: "개발 공부 중",
  openGraph: {
    type: "website",
    url: "https://dovb.vercel.app",
    title: "Dovb`s Blog",
    description: "개발 공부 중",
    site_name: "Dovb`s Blog",
    images: [
      {
        url: "https://dovb.vercel.app/icon/icon-192x192.png",
        width: 192,
        height: 192,
      },
    ],
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
  let db = new FbDatabase(false);
  // 구글 firebase 초기화
  useEffect(() => {
    initializeApp(firebaseConfig);

    const messaging = getMessaging();

    getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FB_VAPID_KEY,
    })
      .then((currentToken) => {
        if (currentToken) {
          db.getToken(currentToken).then((res) => {
            console.log(res);
            if (res === null) {
              db.insertToken(currentToken);
              localStorage.setItem("token", currentToken);
              localStorage.setItem("noti", "false");
            } else {
              localStorage.setItem("token", res.token);
              localStorage.setItem("noti", res.notification + "");
            }
          });
        } else {
          // Show permission request UI
          console.log("No registration token available. Request permission to generate one.");
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
        <ToastContainer
          position="top-right"
          autoClose={8000}
          hideProgressBar={false}
          newestOnTop={false}
          draggable={false}
          closeOnClick
          pauseOnHover
        />
      </AuthProvider>
    </>
  );
};

export default CustomApp;
