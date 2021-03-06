//定数
var FPS = 240;
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT =window.innerHeight;
var GRAVITY = 0;

//変数
var ctx;
var particleList = [];
var mx = null;
var my = null;
var mx1 = null;
var my1 = null;
var mx2 = null;
var my2 = null;
var posFlg = 0;
var isMove = true;

//コンストラクタ
var Particle = function (x, y) {
  this.x = x;
  this.y = y;
};

//プロパティとメソッド
Particle.prototype = {
  //プロパティ
  x: null,
  y: null,
  r: 0,
  g: 0,
  b: 0,
  a: 0,
  vx: 0,
  vy: 0,
  radius: 0,
  color: null,
  isRemove: false,

  //初速度、サイズ、色をランダムに指定
  create: function () {
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.radius = Math.random() * 2 + 1;
    r = Math.floor(Math.random() * 255);
    g = Math.floor(Math.random() * 255);
    b = Math.floor(Math.random() * 255);
    this.a = Math.round(Math.random() * 10) / 10;
    this.color = "rgba(" + r + ","+ g + "," + b + "," + this.a + ")";
    if(isMove == false){
      this.isRemove = true;
    }
  },

  //位置を更新
  update: function () {
    this.vy += GRAVITY;
    this.a -= 0.01;
    //this.color = "rgba(" + r + ","+ g + "," + b + "," + this.a + ")";
    this.x += this.vx;
    this.y += this.vy;
    this.radius += .01;
    //パーティクルが画面の外に出たとき削除フラグを立てる
    if (this.x < 0 || this.x > SCREEN_WIDTH || this.y > SCREEN_HEIGHT || this.a < 0) {
      this.isRemove = true;
    }
  },

  //描画
  draw: function () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }
}

//canvasの取得とマウスイベントの設定
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
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  ctx = canvas.getContext("2d");
  //canvasにマウスイベントを登録
  canvas.addEventListener("mousemove", updateMousePos, false);  //マウス移動時イベント
  canvas.addEventListener("mosueout", resetMousePos, false);  //マウスが画面外に出た際のイベント
  //メインループを実行
  loop();
};

//マウスの位置を取得
var updateMousePos = function (e) {
  var rect = e.target.getBoundingClientRect();
  mx = e.clientX - rect.left;
  my = e.clientY - rect.top;
};

setInterval('xyMove()',10);
//マウスが動いているか判定
function xyMove () {
  if(posFlg == 0){
    mx1 = mx;
    my1 = my;
    posFlg = 1;
  }else{
    mx2 = mx;
    my2 = my;
    posFlg = 0;
  }
  if (mx1 == mx2 && my1 == my2) {
    isMove = false;
  }else{
    isMove = true;
  }
}

//マウスの位置をリセット
var resetMousePos = function (e) {
  mx = null;
  my = null;
};

//メインループ
var loop = function () {
  add();
  update();
  draw();
  setTimeout(loop, 1000 / FPS);
};

//パーティクルの追加
var add = function () {
  if ( mx !== null && my !== null){
    //インスタンスを作成
    var p = new Particle(mx, my);
    p.create();
    //インスタンスを配列に格納
    particleList.push(p);
  }
};

//パーティクルの位置を更新
var update = function () {
  var list = [];
  for (var i = 0; i < particleList.length; i++) {
    particleList[i].update();
    //削除フラグがたっていなければ配列に格納
    if (!particleList[i].isRemove) {
      list.push(particleList[i]);
    }
  }
  particleList = list;
};

//パーティクルの描画
var draw = function () {
  //背景を描画
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  //パーティクルを描画
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (var i = 0; i < particleList.length; i++) {
    particleList[i].draw();
  }
  ctx.restore();
};
