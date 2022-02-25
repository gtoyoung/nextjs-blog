import { useEffect } from "react";

export const useImgIObserver = (target) => {
  useEffect(() => {
    const images = document.querySelectorAll(".lazy");

    const callback: IntersectionObserverCallback = (
      entries: IntersectionObserverEntry[]
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          var image: any = entry.target;
          image.src = image.dataset.src;
          image.classList.remove("lazy");
          observer.unobserve(image);
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px 0px 900px 0px",
    });

    images.forEach((image) => {
      observer.observe(image);
    });

    return () => observer.disconnect();
  }, [target]);
};
