import { Tree } from "./tree.js";

class App {
  constructor() {
    // 첫번째 레이어
    this.backCanvas = document.createElement("canvas");
    this.backCanvas.classList.add("snowBack");
    this.backCanvas.style = "position: absolute; top: 0; left: 0; z-index: 0; display: none;";
    document.body.appendChild(this.backCanvas);
    // 두번째 레이어
    this.backCanvas2 = document.createElement("canvas");
    this.backCanvas2.classList.add("rainBack");
    this.backCanvas2.style = "position: absolute; top: 0; left: 0; z-index: 0; display: none;";
    document.body.appendChild(this.backCanvas2);

    // 세번째 레이어
    this.canvas = document.createElement("canvas");
    this.canvas.style = "position: absolute; top: 0; left: 0; z-index: 1;";
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.backCtx = this.backCanvas.getContext("2d");
    this.backCtx2 = this.backCanvas2.getContext("2d");
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    this.depth = 0;
    this.angle = 0;
    this.mp = 1000;
    this.particles = [];
    // snowflake paritcles
    for (var i = 0; i < this.mp; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth, //x-coordinate
        y: Math.random() * window.innerHeight, //y-coordinate
        r: Math.random() * 4 + 1, //radius
        d: Math.random() * this.mp, //density
      });
    }

    this.rains = [];
    var maxParts = 1000;
    for (var i = 0; i < maxParts; i++) {
      this.rains.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        l: Math.random() * 1,
        xs: -4 + Math.random() * 4 + 2,
        ys: Math.random() * 10 + 10,
      });
    }

    this.rainParticles = [];
    for (var i = 0; i < maxParts; i++) {
      this.rainParticles[i] = this.rains[i];
    }

    window.addEventListener("resize", this.resize.bind(this), false);

    if (this.isMobile()) {
      window.addEventListener("touchstart", this.touchStart.bind(this), false);
      window.addEventListener("touchend", this.touchEnd.bind(this), false);
    } else {
      window.addEventListener("click", this.click.bind(this), false);
      window.addEventListener("mousedown", this.mouseDown.bind(this), false);
      window.addEventListener("mouseup", this.mouseUp.bind(this), false);
    }

    setInterval(this.snowDraw.bind(this), 20);
    setInterval(this.rainDraw.bind(this), 30);
    this.drawCloud();
    this.resize();
    // this.setBtn();
  }

  drawCloud() {
    this.container = document.getElementById("container");
    for (var i = 0; i < 10; i++) {
      var cloud_gif = new Image();
      var top = "20" - (i % 2) * 18 + "px";
      var left = -70 + i * 230 + "px";
      cloud_gif.style = `position: absolute; top: ${top}; left: ${left};`;
      cloud_gif.src = "../trees/src/img/cloud.gif";
      this.container.appendChild(cloud_gif);
    }
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
    if (this.depth < 18) {
      document.body.getElementsByClassName("treeCnt")[0].textContent =
        this.depth + "반복되는 나무가 생성될 예정입니다.";
      this.depth = this.depth + 1;
    } else {
      document.body.getElementsByClassName("treeCnt")[0].textContent = this.depth + "초과는 생성되지 않습니다.";
    }
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

    this.nightBtn.addEventListener("click", this.nightBtnHandler.bind(this), false);
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

  // 눈 그리기
  snowDraw() {
    var w = document.body.clientWidth;
    var h = document.body.clientHeight;

    this.backCanvas.width = w * this.pixelRatio;
    this.backCanvas.height = h * this.pixelRatio;

    this.backCtx.scale(this.pixelRatio, this.pixelRatio);
    this.backCtx.clearRect(0, 0, w, h);
    this.backCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
    this.backCtx.beginPath();

    for (var i = 0; i < this.mp; i++) {
      var p = this.particles[i];
      this.backCtx.moveTo(p.x, p.y);
      this.backCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
    }
    this.backCtx.fill();
    this.update(w, h);
  }

  update(w, h) {
    this.angle += 0.01;
    for (var i = 0; i < this.mp; i++) {
      var p = this.particles[i];
      //Updating X and Y coordinates
      //We will add 1 to the cos function to prevent negative values
      //which will result in the flakes to move upwards
      //Every particle has its own density which can be used to make the downward movement different for each flake
      //Let's make it more random by adding in the radius
      p.y += Math.cos(this.angle + p.d) + 1 + p.r / 2;
      p.x += Math.sin(this.angle) * 2;
      if (p.x > w + 5 || p.x < -5 || p.y > h) {
        if (i % 3 > 0) {
          this.particles[i] = {
            x: Math.random() * w,
            y: -10,
            r: p.r,
            d: p.d,
          };
        } else {
          if (Math.sin(this.angle) > 0) {
            this.particles[i] = {
              x: -5,
              y: Math.random() * h,
              r: p.r,
              d: p.d,
            };
          } else {
            this.particles[i] = {
              x: w + 5,
              y: Math.random() * h,
              r: p.r,
              d: p.d,
            };
          }
        }
      }
    }
  }

  rainDraw() {
    var w = document.body.clientWidth;
    var h = document.body.clientHeight;

    this.backCanvas2.width = w * this.pixelRatio;
    this.backCanvas2.height = h * this.pixelRatio;

    this.backCtx2.strokeStyle = "rgba(174,194,224,0.5)";
    this.backCtx2.lineWidth = 2;
    this.backCtx2.lineCap = "round";

    this.backCtx2.scale(this.pixelRatio, this.pixelRatio);
    this.backCtx2.clearRect(0, 0, w, h);

    for (var i = 0; i < this.rainParticles.length; i++) {
      var p = this.rainParticles[i];
      this.backCtx2.beginPath();
      this.backCtx2.moveTo(p.x, p.y);
      this.backCtx2.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
      this.backCtx2.stroke();
    }

    this.move(w, h);
  }

  move(w, h) {
    for (var i = 0; i < this.rainParticles.length; i++) {
      var p = this.rainParticles[i];
      p.x += p.xs;
      p.y += p.ys;
      if (p.x > w || p.y > h) {
        p.x = Math.random() * w;
        p.y = -20;
      }
    }
  }
}

window.onload = () => {
  new App();
};
