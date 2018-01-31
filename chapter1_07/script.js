(function($){
  'use strict';
  var cv = document.getElementById('textCv'),
  ctx = cv.getContext('2d'),
  paddingWindow = 20*2,
  inputAreaHeight = 100,
  W = cv.width = window.innerWidth - paddingWindow,
  H = cv.height = window.innerHeight - paddingWindow - inputAreaHeight,
  imgCv = document.createElement('canvas'),
  imgCtx = imgCv.getContext('2d'),
  imgText = new Image(),
  fontSize = 60,
  randomPos,// アニメーション時に画像を描画する位置をrandomに決める
  start = true;

  $(document).ready(function(){
    init();
  });

  /* 初期設定 */
  function init(){
    watchForm();// 入力されるテキストを監視する
    $('#selectColor').on('change', drawText);// 色をプルダウンで選択時
    setImageCanvas();// アニメーション用のcanvasを生成

    imgText.onload = function(){
      if(start) {
        animation();
        start = false;// この後はanimation()を実行しない
      }
    };
  }

  /* フォームに入力されたテキストを監視 */
  function watchForm(){
    var timerID;

    $('#inputText').on("focus", function(){
      timerID = setInterval(drawText, 60);
    });
    $('#inputText').on("blur", function(){
      clearInterval(timerID);
    });
  }

  /* textをcanvasに描画 */
  /* 入力されたテキストをcanvasに描画 */
  function drawText(){
    var inputText = $('#inputText').val();
    var colorText = $('#selectColor').val();

    ctx.clearRect(0, 0, W, H);
    ctx.textBaseline = 'middle';// テキストの縦の基準値
    ctx.textAlign = 'center';// テキストのスタート位置
    ctx.shadowColor = colorText;// ぼかしの色を定義
    ctx.shadowBlur = 10;// ぼかしの範囲を定義
    ctx.font = 'bold 80px "Audiowide"';// フォントスタイルを定義
    ctx.fillStyle = '#ffffff';// 色を決める
    ctx.fillText(inputText, W / 2, H / 2, W);// テキストを描画
    changeImg();
  }

  /*********************************
   * imageデータに変換
   *********************************/
  // canvasに描いたテキストをimgに変換
  function changeImg(){
    var imgPngUrl = cv.toDataURL();
    imgText.src = imgPngUrl;
  }
  // 結果用のcanvasをセット
  function setImageCanvas(){
    imgCv.setAttribute('width', W);
    imgCv.setAttribute('height', H);
    $('#textCv').after(imgCv);
  }

  /*********************************
   * animation
   *********************************/
  /* animationの初期設定 */
  function initAnimation(){
    // canvasをclearする
    imgCtx.clearRect(0, 0, W, H);
    effectViberation();
  }
  /* imageデータを1pxずつランダムでずらして描画 */
  function effectViberation(){
    var range = $('#rangeViberation').val();
    //1pxずつずらして描画
    for (var i = 0; i < H; i+=2) {
      randomPos = Math.floor(Math.random()*range);
      imgCtx.drawImage(imgText, 0, i, W, 1, randomPos, i, W, 1);
    }
  }
  /* アニメーションさせるためのループ */
  function animation(){
    function animationLoop(){
      initAnimation();
      requestAnimationFrame(animationLoop);
    }
    animationLoop();
  }
  /* requestAnimationFrameの設定 */
  window.requestAnimationFrame = (function(){
    return window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function( callback ) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();
})(jQuery);
