$(function() {
  historyLoad();//保存データ呼び出し、セット
  //ボタンをstartとリセットのみ表示
  $('#lap, #stop').css('display','none');
  $('#start, #reset').css('display','inline-block');
  //aleat(location.origin);

  /* ボタン操作 */
  $('#start').click(function() {
    //ラップタイム計測＆記録
    timerOn = setInterval( timer, 10 );
    preTimeGet();
    $('#lap, #stop').css('display','inline-block');
    $('#start, #reset').css('display','none');
  });

  $('#lap').click(function() {
    preTimeGet();
    $('#log').prepend("<li>" + $('#nowlap').text() + "</li>");
    localStorage.setItem('historylog',$('#log').html());
  });

  $('#stop').click(function() {
    stopTime();
  });

  $('#reset').click(function() {
    stopTime();
    clearHistory();
    $('#nowlap').text('00:00.0');
  });
});

/* ラップタイム履歴関連 */
//カウンタ更新時間を呼び出し 保存データが無い時は初期化
function historyLoad() {
  if(localStorage.getItem('historylog')) {
    $('#log').html(localStorage.getItem('historylog'));
  } else {
    $('#log').html("");
  }
}
//履歴時間をクリア
function clearHistory() {
  localStorage.removeItem('historylog');
  $('#log').html("");
}

/* 計測開始時間 */
function preTimeGet() {
  preTime = new Date();//現在時刻取得
  preTimeGT = preTime.getTime();
}

/* ラップタイムリアルタイム表示（タイマー開始ボタンを押した時の動作で使用） */
function timer() {
  nowTime = new Date();
  T = nowTime.getTime() - preTimeGT;
  //時間の整形
  M = Math.floor( T / ( 60 * 1000 ) );
  T = T - ( M * 60 * 1000 );
  S = Math.floor( T / 1000 );
  Ms = T % 1000;
  if( M < 10 ){ M = "0" + M; }
  if( S < 10 ){ S = "0" + S; }
  if( Ms < 10 ){
    Ms = "00" + Ms;
  } else if ( Ms < 100 ) {
    Ms = "0" + Ms;
  }
  checkLap = M + ":" + S + "." + Ms;
  $('#nowlap').text(checkLap);//時間経過を表示
  //テスト $('#nowlap').text("checkLap " + checkLap + "：Stop " + Stop + "：lapPushGT " + lapPushGT);
}

/* ストップ */
function stopTime() {
  clearTimeout (timerOn);
  preTimeGT = 0;
  $('#lap, #stop').css('display','none');
  $('#start, #reset').css('display','inline-block');
}
