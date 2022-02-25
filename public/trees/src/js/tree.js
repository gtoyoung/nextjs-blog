import { Branch } from "./branch.js";

const COLOR_ARR = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
];

export class Tree {
  constructor(ctx, posX, posY, day, depth) {
    this.ctx = ctx;
    this.posX = posX;
    this.posY = posY;
    this.branches = [];
    this.depth = depth;
    this.day = day;
    this.isPressed = false;
    this.interval = null;
    this.color = COLOR_ARR[Math.floor(Math.random() * COLOR_ARR.length)];

    this.cntDepth = 0;
    this.animation = null;
    this.init();
  }

  init() {
    for (let i = 0; i < this.depth; i++) {
      this.branches.push([]);
    }
    //뿌리 생성
    this.createBranch(this.posX, this.posY, -90, 0);
    this.draw();

    document.body.getElementsByClassName("treeCnt")[0].textContent =
      "생성되었습니다.";
  }

  createBranch(startX, startY, angle, depth) {
    if (depth === this.depth) return;

    const len = depth === 0 ? this.random(10, 13) : this.random(0, 11);

    const endX = startX + this.cos(angle) * len * (this.depth - depth);
    const endY = startY + this.sin(angle) * len * (this.depth - depth);

    this.branches[depth].push(
      new Branch(startX, startY, endX, endY, this.depth - depth, this.color)
    );

    this.createBranch(endX, endY, angle - this.random(15, 23), depth + 1);
    this.createBranch(endX, endY, angle + this.random(15, 23), depth + 1);
  }

  draw() {
    if (this.cntDepth === this.depth) {
      cancelAnimationFrame(this.animation);
    }

    for (let i = this.cntDepth; i < this.branches.length; i++) {
      let pass = true;

      for (let j = 0; j < this.branches[i].length; j++) {
        pass = this.branches[i][j].draw(this.ctx);
      }

      if (!pass) break;
      this.cntDepth++;
    }

    this.animation = requestAnimationFrame(this.draw.bind(this));
  }

  cos(angle) {
    return Math.cos(this.degToRad(angle));
  }
  sin(angle) {
    return Math.sin(this.degToRad(angle));
  }
  degToRad(angle) {
    return (angle / 180.0) * Math.PI;
  }

  random(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }
}
