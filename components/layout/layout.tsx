import React from "react";
import { ErrorBoundary } from "../error-boundary";
import { Footer } from "components/layout";
import { CustomHeader } from "./paperheader";

export const Layout = (props) => {
  return (
    <>
      <CustomHeader />
      <ErrorBoundary>
        <main className="container mt-3">{props.children}</main>
      </ErrorBoundary>
      <Footer />
    </>
  );
};
