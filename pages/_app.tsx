import App from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import { DefaultSeo } from "next-seo";
import "papercss/dist/paper.min.css";
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

export default class CustomApp extends App {
  componentDidMount() {
    Router.events.on("routeChangeComplete", () => {
      NProgress.start();
    });

    Router.events.on("routeChangeComplete", () => {
      NProgress.done();
    });
    Router.events.on("routeChangeError", () => {
      NProgress.done();
    });
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error);
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <DefaultSeo {...DEFAULT_SEO} />
        <Component {...pageProps} />;
      </>
    );
  }
}
