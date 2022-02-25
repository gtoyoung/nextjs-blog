import { Tree } from "./tree.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    this.depth = 0;
    window.addEventListener("resize", this.resize.bind(this), false);

    if (this.isMobile()) {
      window.addEventListener("touchstart", this.touchStart.bind(this), false);
      window.addEventListener("touchend", this.touchEnd.bind(this), false);
    } else {
      window.addEventListener("click", this.click.bind(this), false);
      window.addEventListener("mousedown", this.mouseDown.bind(this), false);
      window.addEventListener("mouseup", this.mouseUp.bind(this), false);
    }
    this.resize();
    // this.setBtn();
  }

  isMobile() {
    var userAgent = navigator.userAgent;

    if (
      userAgent.match(
        /iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i
      ) != null ||
      userAgent.match(/LG|SAMSUNG|Samsung/) != null
    ) {
      return true;
    } else {
      return false;
    }
  }

  touchStart(event) {
    this.depth = 0;
    this.interval = setInterval(this.setDepth.bind(this), 200);
  }

  touchEnd(event) {
    clearInterval(this.interval);

    const { clientX } = event.changedTouches[0];
    new Tree(this.ctx, clientX, this.stageHeight, this.day, this.depth);
  }

  setDepth() {
    document.body.getElementsByClassName("treeCnt")[0].textContent =
      this.depth + "반복되는 나무가 생성될 예정입니다.";
    this.depth = this.depth + 1;
  }

  mouseDown(e) {
    this.depth = 0;
    this.interval = setInterval(this.setDepth.bind(this), 200);
  }

  mouseUp(e) {
    clearInterval(this.interval);
  }

  setBtn() {
    this.nightBtn = document.querySelector(".night");
    this.dayBtn = document.querySelector(".day");

    this.day = true;

    this.nightBtn.addEventListener(
      "click",
      this.nightBtnHandler.bind(this),
      false
    );
    this.dayBtn.addEventListener("click", this.dayBtnHandler.bind(this), false);
  }

  nightBtnHandler() {
    this.resize();
    this.dayBtn.classList.add("show");
    this.nightBtn.classList.remove("show");
    document.body.classList.add("black");
    this.day = false;
  }

  dayBtnHandler() {
    this.resize();
    this.dayBtn.classList.remove("show");
    this.nightBtn.classList.add("show");
    document.body.classList.remove("black");
    this.day = true;
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
  }

  click(event) {
    const { clientX } = event;
    if (event.target.className !== "material-icons") {
      new Tree(this.ctx, clientX, this.stageHeight, this.day, this.depth);
    }
  }
}

window.onload = () => {
  new App();
};
