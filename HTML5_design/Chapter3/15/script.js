$(function () {
	// 初期設定
	var videoObj = $("#myvideo").get(0);

	// 再生可能かチェック
	if (!videoObj || !videoObj.canPlayType) {
		$(".videoplayer-cap, .videoplayer-ui").hide();
		return false;
	}

	$(".videoplayer-bar-played").width("0%");

	// 秒数を時間表記に変換
	var secondsToTime = function (seconds) {
		var min = Math.floor(seconds / 60);  // 分
		var sec = Math.floor(seconds % 60);  // 秒
		if (min < 10) {
			min = "0" + min;
		}
		if (sec < 10) {
			sec = "0" + sec;
		}
		return min + ":" + sec;
	};

	// 現在の再生時間／総再生時間を返す
	var getTimeStr = function () {
		return secondsToTime(videoObj.currentTime) + " / " + secondsToTime(videoObj.duration);
	}

	// 再生可能になった初回のとき
	videoObj.addEventListener("loadeddata", function () {
		$(".videoplayer-time").html(getTimeStr());
	});

	// 再生位置が変更されたとき
	videoObj.addEventListener("timeupdate", function () {
		$(".videoplayer-time").html(getTimeStr());
		$(".videoplayer-bar-played").width((videoObj.currentTime / videoObj.duration) * 100 + "%");
	});

	// 再生が終了したとき
	videoObj.addEventListener("ended", function () {
		$(".videoplayer")
			.removeClass("videoplayer-playing")
			.addClass("videoplayer-stopped");
		$(".videoplayer-ui").stop().animate({ opacity: 1 }, 500);
	});

	// 再生／停止ボタンをクリックしたとき
	$(".videoplayer-playpause a").click(function () {
		if (videoObj.paused == true) {
			videoObj.play();
			$(".videoplayer")
				.removeClass("videoplayer-stopped")
				.addClass("videoplayer-playing");
		}
		else {
			videoObj.pause();
			$(".videoplayer")
				.removeClass("videoplayer-playing")
				.addClass("videoplayer-stopped");
		}
	});

	// 巻き戻しボタンをクリックしたとき
	$(".videoplayer-rewind a").click(function () {
		videoObj.currentTime = 0;
	});

	// ボリュームボタンをクリックしたとき
	$(".videoplayer-volume a").click(function () {
		if (videoObj.volume == 1) {
			videoObj.volume = 0;
			$(".videoplayer").addClass("videoplayer-muted");
		}
		else {
			videoObj.volume = 1;
			$(".videoplayer").removeClass("videoplayer-muted");
		}
	});

	// プレーヤーにマウスオーバー／アウトしたとき
	$(".videoplayer").hover(function () {
		$(".videoplayer-cap").stop().animate({ opacity: 1 }, 500);
	},function () {
		$(".videoplayer-cap").stop().animate({ opacity: 0 }, 500);
	});
});