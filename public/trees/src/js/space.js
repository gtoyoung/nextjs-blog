class Space {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 300;
    this.canvas.height = 300;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.sun = document.createElement("img");
    this.sun.src = "https://mdn.mozillademos.org/files/1456/Canvas_sun.png";
    this.moon = document.createElement("img");
    this.moon.src = "https://mdn.mozillademos.org/files/1443/Canvas_moon.png";
    this.earth = document.createElement("img");
    this.earth.src = "https://mdn.mozillademos.org/files/1429/Canvas_earth.png";
    setInterval(() => this.draw(this.ctx), 100);
  }

  draw(ctx) {
    ctx.globalCompositeOperation = "destination-over";
    ctx.clearRect(0, 0, 300, 300); // 캔버스를 비운다

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.strokeStyle = "rgba(0,153,255,0.4)";
    ctx.save();
    ctx.translate(150, 150);

    // 지구
    var time = new Date();
    ctx.rotate(
      ((2 * Math.PI) / 60) * time.getSeconds() +
        ((2 * Math.PI) / 60000) * time.getMilliseconds()
    );
    ctx.translate(105, 0);
    ctx.fillRect(0, -12, 50, 24); // Shadow
    ctx.drawImage(this.earth, -12, -12);

    // 달
    ctx.save();
    ctx.rotate(
      ((2 * Math.PI) / 6) * time.getSeconds() +
        ((2 * Math.PI) / 6000) * time.getMilliseconds()
    );
    ctx.translate(0, 28.5);
    ctx.drawImage(this.moon, -3.5, -3.5);
    ctx.restore();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // 지구 궤도
    ctx.stroke();

    ctx.drawImage(this.sun, 0, 0, 300, 300);
  }
}

window.onload = function () {
  new Space();
};
