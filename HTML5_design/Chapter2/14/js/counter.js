/*いろいろなところで繰り返し使う*/
/*-----------------------------------------------------------*/

//カウントの値を保存
var dataSave = function () {
localStorage.setItem('dataCount',$('#count').text());
}


//カウンタの値を呼び出し 保存データが無いときは初期化
var countLoad = function () {
if(localStorage.getItem('dataCount')){
$('#count').text(localStorage.getItem('dataCount'));
} else {
$('#count').text("0");
}
}


/*カウンタ*/
/*-----------------------------------------------------------*/
$(function() {

///////保存データ呼び出し、セット////////
countLoad();

///////ボタンクリック////////

//＋をクリック
$('#plusCount').bind('touchend' , function() {
update($("#count"));
});

//＋をクリック　数字カウント時
function update(e) {
var n = parseInt(e.text(), 10);
e.text(n + 1);

//カウントした値を保存
dataSave();
}});


//ーをクリック
//////////////////////////////////////////////
$(function() {
$('#minusCount').bind('touchend', function() {
downdate($("#count"));
});


//マイナスをクリック　数字カウント時
function downdate(e) {
var n = parseInt(e.text(), 10);
e.text(n - 1);

//カウントした値を保存
dataSave();
}
});

//リセット
//////////////////////////////////////////////
$(function() {
$('#clear').bind('touchend', function() {
$('#count').text("0");
dataSave();
});
});


//////デバイスのサイズ違いでbodyにclass追加
var checkWinSize = function () {
if(Math.abs(window.innerHeight) < 480){
$("body").addClass("short");
}
}

//カウンターを開いたときに実行
window.onload = checkWinSize;


