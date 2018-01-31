window.onload = function () {
	// 要素を取得
	var roadMap = Snap.select("#roadMap");
	var map = roadMap.select("#map");

	// 目的地の矩形を描画
	var goal = map.rect(345, 109, 21, 21);
	goal.attr({
		fill: "#192D4A",
		stroke: "#FFF",
		strokeWidth: 2
	});

	// 現在地の円を描画
	var pt = map.circle(122, 404, 12);
	pt.attr({
		fill: "#C53645",
		stroke: "#FFF",
		strokeWidth: 8
	});

	// テキストを描画
	map.text(135, 430, "START").attr({
		font: "bold 18px Arial, sans-serif",
		fill: "#192D4A"
	});

	map.text(327, 98, "GOAL!!").attr({
		font: "bold 18px Arial, sans-serif",
		fill: "#192D4A"
	});

	// 地図にマスクをかける
	var maskCircle = roadMap.circle(250, 250, 250);

	maskCircle.attr({
		fill: "#FFF"
	});

	map.attr({
		mask: maskCircle
	});

	// 経路の線を消す
	var route = map.select("#route");
	route.attr({
		display: "none"
	});

	// 経路のパスの長さを取得
	var len = route.getTotalLength();

	// 軌跡のパスを作成
	var track = map.path();

	track.attr({
		fill: "none",
		stroke: "#192D4A",
		strokeWidth: 3,
		strokeDasharray: "5 3"
	});

	track.insertBefore(pt);

	// 地図をクリックしたときの処理
	roadMap.click(function () {
		Snap.animate(0, len, function (val) {
			// 現在地を移動
			var dot = route.getPointAtLength(val);
			pt.attr({
				cx: dot.x,
				cy: dot.y
			});

			// 軌跡のパスを描画
			track.attr({
				d: route.getSubpath(0, val)
			});
		}, 10000);
	});
};