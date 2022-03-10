import { useState } from "react";

const useTheme = () => {
  let prefersColorScheme = null;
  if (typeof window !== "undefined") {
    prefersColorScheme = window.matchMedia("prefers-color-scheme: dark").matches
      ? "dark"
      : "light";
  }
  let localTheme = null;
  if (typeof window !== "undefined") {
    localTheme = localStorage.getItem("theme");
  }
  const initialTheme = localTheme || prefersColorScheme;
  const [theme, setTheme] = useState(initialTheme);

  const setMode = (mode) => {
    var root = document.getElementsByTagName("html")[0];
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", mode);
    }
    if (mode === "dark" && typeof window !== "undefined") {
      root.classList.add("dark");
      document.body.style.background = "#41403e";
      document.getElementById("themeChanger").textContent = "🌞";
    } else if (mode === "light" && typeof window !== "undefined") {
      root.classList.remove("dark");
      document.body.style.backgroundColor = "#fff";
      document.getElementById("themeChanger").textContent = "🌙";
    }
    setTheme(mode);
  };

  const themeToggler = () => {
    theme === "light" ? setMode("dark") : setMode("light");
  };

  return [theme, themeToggler];
};
export default useTheme;
