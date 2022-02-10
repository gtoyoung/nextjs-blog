import Router from "next/router";
import NProgress from "nprogress";
import { DefaultSeo } from "next-seo";
import "papercss/dist/paper.min.css";
import { useEffect } from "react";
import useTheme from "hook/useTheme";

const DEFAULT_SEO = {
  title: "Dovb`s Blog",
  description: "Awesome blog tutorial website",
  openGraph: {
    type: "website",
    locale: "en",
    title: "Dovb`s Blog",
    description: "Awesome blog tutorial website",
    site_name: "BlogTutorial",
  },
};

const CustomApp = ({ Component, pageProps }) => {
  const [theme, themeToggler] = useTheme();

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
  });
  return (
    <>
      <DefaultSeo {...DEFAULT_SEO} />
      <Component {...pageProps} />
      <button
        id="themeBtn"
        className="btn_theme"
        onClick={themeToggler}
      ></button>
    </>
  );
};

export default CustomApp;
