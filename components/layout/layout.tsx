import React from "react";
import { ErrorBoundary } from "../error-boundary";
import { CustomHeader } from "./paperheader";

export const Layout = (props) => {
  return (
    <>
      <CustomHeader />
      <ErrorBoundary>
        {props.isMax ? (
          <main>{props.children}</main>
        ) : (
          <main className={"container mt-3"}>{props.children}</main>
        )}
      </ErrorBoundary>
      {/* <Footer /> */}
    </>
  );
};
