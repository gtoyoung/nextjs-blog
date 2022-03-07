import React from "react";
import Link from "next/link";

export const CustomHeader = () => {
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
          </ul>
        </div>
      </div>
    </nav>
  );
};
