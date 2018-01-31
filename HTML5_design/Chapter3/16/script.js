$(function () {
	// 初期設定
	var audioObj = $("#myaudio").get(0);

	// 再生可能かチェック
	if (!audioObj || !audioObj.canPlayType) {
		$(".audioplayer").hide();
		return false;
	}

	$(".audioplayer-bar-played").width("0%");

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

	// 再生可能になった初回のとき
	audioObj.addEventListener("loadeddata", function () {
		$(".audioplayer-duration").html(secondsToTime(audioObj.duration));
	});

	// 再生位置が変更されたとき
	audioObj.addEventListener("timeupdate", function () {
		$(".audioplayer-current").html(secondsToTime(audioObj.currentTime));
		$(".audioplayer-bar-played").width((audioObj.currentTime / audioObj.duration) * 100 + "%");
	});

	// 再生が終了したとき
	audioObj.addEventListener("ended", function () {
		$(".audioplayer")
			.removeClass("audioplayer-playing")
			.addClass("audioplayer-stopped");
	});

	// 再生／停止ボタンをクリックしたとき
	$(".audioplayer-playpause a").click(function () {
		if (audioObj.paused == true) {
			audioObj.play();
			$(".audioplayer")
				.removeClass("audioplayer-stopped")
				.addClass("audioplayer-playing");
		}
		else {
			audioObj.pause();
			$(".audioplayer")
				.removeClass("audioplayer-playing")
				.addClass("audioplayer-stopped");
		}
	});

	// ボリュームボタンをクリックしたとき
	$(".audioplayer-volume a").click(function () {
		if (audioObj.volume == 1) {
			audioObj.volume = 0;
			$(".audioplayer").addClass("audioplayer-muted");
		}
		else {
			audioObj.volume = 1;
			$(".audioplayer").removeClass("audioplayer-muted");
		}
	});
});