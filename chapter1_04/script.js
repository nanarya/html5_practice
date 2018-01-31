//定数
var FPS = 60;
var ROW = 25;
var COL = 15;
var MAX_DIS = 300;  //反応距離
var SPRING = 0.1; //バネ係数
var FRICTION = 0.9; //摩擦係数

//変数
var ctx;
var canvasW;
var canvasH;
var ballList = [];
var mx = null;
var my = null;

//マウスの位置を取得
window.onload = function () {
  init();
};
//初期設定
var init = function () {
  var canvas = document.getElementById("mycanvas");
  //canvas要素の存在をチェック
  if (!canvas || !canvas.getContext) {
    return false;
  }
  ctx = canvas.getContext("2d");
  canvasW = canvas.width;
  canvasH = canvas.height;
  //canvasにマウスイベントを登録
  canvas.addEventListener("mousemove", updateMousePos, false);
  canvas.addEventListener("mouseout", resetMousePos, false);
  create();
  loop();
};
//マウスの位置を取得
var updateMousePos = function (e) {
  var rect = e.target.getBoundingClientRect();
  mx = e.clientX - rect.left;
  my = e.clientY - rect.top;
};
//マウスの位置をリセット
var resetMousePos = function (e) {
  mx = null;
  my = null;
};
//ボールを作成
var create = function () {
  //縦横に並べる
  var spacex = canvasW / ROW * 0.8;
  var spacey = canvasH / COL * 0.8;
  for (var i = 0; i < ROW; i++) {
    for (var j = 0; j < COL; j++) {
      var ofsx = (canvasW - spacex * (ROW - 1)) / 2;
      var ofsy = (canvasH - spacey * (COL - 1)) / 2;
      //インスタンスを作成
      var ball = new Ball(
        spacex * i + ofsx,
        spacey * j + ofsy
      );
      //インスタンスを配列に格納
      ballList.push(ball);
    }
  }
};
//メインループ
var loop = function () {
  update();
  draw();
  setTimeout(loop, 1000 / FPS);
};
//ボールの位置を更新
var update = function () {
  for (var i = 0; i < ballList.length; i++) {
    ballList[i].update();
  }
};
//ボールの描画
var draw = function () {
  //背景を描画
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, canvasW, canvasH);
  //ボールを描画
  for (var i = 0; i < ballList.length; i++) {
    ballList[i].drawLine();
    ballList[i].drawCircle();
  }
};
//コンストラクタ
var Ball = function (x0, y0) {
  this.x0 = this.x = x0;
  this.y0 = this.y = y0;
};
//プロパティとメソッド
Ball.prototype = {
  //プロパティ
  x0: null,
  y0: null,
  x: null,
  y: null,
  vx: 0,
  vy: 0,
  color: null,
  radius: null,
  //位置を更新
  update: function () {
    var dx = this.x0;
    var dy = this.y0;
    this.radius = 1;
    if (mx !== null && my !== null) {
      //マウスから初期座標までの距離を計算する
      var dis = Math.sqrt(Math.pow(this.x0 - mx, 2) + Math.pow(this.y0 - my, 2));
      //距離によってボールの位置と半径を設定する
      if (dis < MAX_DIS) {
        //係数
        var k = MAX_DIS - dis;
        //移動させる距離
        var d = -k * 0.1;
        //マウスとボールの角度
        var rad = Math.atan2(my - this.y0, mx - this.x0);
        //移動させる位置
        dx = this.x0 + Math.cos(rad) * d;
        dy = this.y0 + Math.sin(rad) * d;
        //半径
        this.radius = k * 0.05;
      }
    }
    //バネの動きでX座標を設定
    var ax = (dx - this.x) * SPRING;
    this.vx += ax;
    this.vx *= FRICTION;
    this.x += this.vx;
    //バネの動きでX座標を設定
    var ay = (dy - this.y) * SPRING;
    this.vy += ay;
    this.vy *= FRICTION;
    this.y += this.vy;
  },
  //線の描画
  drawLine: function () {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.moveTo(this.x0, this.y0);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
  },
  //円の描画
  drawCircle: function () {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }
};
