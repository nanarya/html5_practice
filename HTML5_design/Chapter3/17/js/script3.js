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

		// ナビゲーションのクリック（タップ）イベント
		prop.mainNavigation.find('a').on('click',function(e){
			// a要素のデフォルトの挙動（href属性で指定された場所にリンクする）をキャンセルする
			if(typeof e.preventDefault !== undefined) {
				e.preventDefault();
			}

			var
			_href = $(this).attr('href'),
			_visible = prop.visible_selector,
			_$sub = $(this).siblings('ul'),
			_$list = $(this).parent('li'),
			_$lists = prop.mainNavigation.find('li');

			// タッチデバイスの時で、サブメニューを持つ親メニューをタッブ場合は、そのサブメニューの開閉を行う
			if(_$sub.length && Modernizr.touch){
				_$lists.not(_$list).removeClass(_visible);
				_$list.toggleClass(_visible);
			} else {
				// タッチデバイスでは無いときや、サブメニューを持っていないときはそのままhref属性の値に従ってリンクする
				location.href = _href;
			}
		})

		// ブラウザ表示領域（スクリーンサイズ）が600ピクセル以下のときに表示される「ナビゲーション開閉スイッチ（※デフォルトでは$('.utilitiesContainer .switch')をクリックしたときの挙動
		prop.utilitiesContainer_switch.on('click', function(){
			// ナビゲーションと、ヘッダユーティリティ領域の表示／非表示を切り替える
			prop.utilitiesContainer.toggleClass(prop.visible_selector);
			prop.mainNavigation.toggleClass(prop.visible_selector);
		});

	};

	MyUtils_Navigation();

})(document, window);