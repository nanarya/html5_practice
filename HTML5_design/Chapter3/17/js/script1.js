;(function(d,w){

	var MyUtils_Navigation;

	MyUtils_Navigation = function(){

		var prop = {
			$window: $(window),
			utilitiesContainer: $('.utilitiesContainer'),
			utilitiesContainer_switch: $('.utilitiesContainer .switch'),
			mainNavigation: $('#mainNavigation'),
			visible_selector: 'visible'
		};

		// ブラウザのツールチップが表示されないようにtitle属性を削除
		$('a[title]').removeAttr('title');

		// タッチデバイスでは無いときに、class名「notouch」をナビゲーションに付与する
		if(!Modernizr.touch){
			prop.mainNavigation.addClass('notouch');
		}

		// ブラウザ表示領域（スクリーンサイズ）が600ピクセル以下のときに表示される「ナビゲーション開閉スイッチ（※デフォルトでは$('.utilitiesContainer .switch')をクリックしたときの挙動
		// prop.utilitiesContainer_switch.on('click', function(){
		// 	// ナビゲーションと、ヘッダユーティリティ領域の表示／非表示を切り替える
		// 	prop.utilitiesContainer.toggleClass(prop.visible_selector);
		// 	prop.mainNavigation.toggleClass(prop.visible_selector);
		// });

	};

	MyUtils_Navigation();

})(document, window);