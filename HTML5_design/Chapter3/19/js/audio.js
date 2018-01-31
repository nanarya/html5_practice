function SE (opts) {
    // 読み込み完了時に実行する関数
    this.onload = opts.onload || function () {};

    // 読み込みが完了しているかどうかを示すプロパティ
    this.isLoaded = false;

    this.initAudio(opts.basename);
}

SE.prototype.initAudio = function (basename) {
    // 拡張子を確定
    var ext = this.getSupportedExt();

    if (!ext) {
        // 再生できる拡張子が見つからなかった場合は中止
        // 効果音が必須となるようなコンテンツでは、ここでエラーを出しておくべきだろう
        // throw new Error('There is no audio types that is supported by this browser.');

        // 今回は、Audio要素に対応していないブラウザでは音を再生しない、
        // というシンプルな回避策をとる。

        console.error('This browser does\'nt support audio element.');
        return;
    }

    // ファイル名を確定して、Audio要素作成
    var filePath = basename + '.' + ext;
    var audio = new Audio(filePath);

    // 読み込み時エラーが起きたら中止
    audio.addEventListener('error', function (err) {
        throw new Error('Fail to load audio file("' + filePath + '").');
    });

    // 再生できる状態になったら、自分のonloadメソッドを呼ぶ
    var self = this;
    function loadListener () {
        if (self.isLoaded) {
            return;
        }

        self.isLoaded = true;
        self.onload();
    }
    audio.addEventListener('canplay', loadListener);
    audio.addEventListener('loadeddata', loadListener);

    // つくったAudio要素をプロパティとして保持
    this.audio = audio;
};

SE.prototype.getSupportedExt = function () {
    // Audio要素で使えるファイルの、拡張子とファイルタイプ
    var audioTypes = [{
        type: 'audio/mpeg',
        ext: 'mp3'
    }, {
        type: 'audio/ogg',
        ext: 'ogg'
    }, {
        type: 'audio/wav',
        ext: 'wav'
    }];

    var supported = [];
    var audio = document.createElement('audio');

    // audioがcanPlayTypeメソッドを持っていない場合、
    // そもそもaudio要素が利用できないということ
    if (!audio.canPlayType) {
        return null;
    }

    // それぞれのファイルタイプが、再生できるかを判定
    // 再生できるならば拡張子をsupportedに追加
    for (var i = 0; i < audioTypes.length; i++) {
        if (audio.canPlayType(audioTypes[i].type)) {
            supported.push(audioTypes[i].ext);
        }
    }

    // supportedの最初のひとつを返す
    return supported[0] || null;
};


SE.prototype.ring = function () {
    var audio = this.audio;

    // initAudioでaudioが作成されていなかった場合は、中止。
    if (!audio) {
        return;
    }

    // このaudioが既に再生されていた場合 = currentTimeが0より大きい場合、
    // 再生位置を最初に戻しておく
    if (audio.currentTime) {
        audio.currentTime = 0;
    }

    // audio再生。
    audio.play();
};

$(function () {
    // スマホかどうかの判定
    var isSP = /iPhone|iPad|iPod|Android/.test(navigator.userAgent);


    // メニューボタン・その親要素をそれぞれ取得しておく
    var $btnNav = $('.btn-nav');
    var $listNav = $('#list-nav');


    // ========================================================
    //  ページを切り替える関数
    //  (本題ではないので、こまかい解説は省略)
    // ========================================================
    function activatePage (el) {
        var $el = $(el);

        if ($el.hasClass('active')) {
            return;
        }

        var href = $el.attr('href') || '';
        var matchData = href.match(/#([a-z\-]+)$/);
        if (!matchData) {
            return;
        }

        var id = matchData[1];
        var $content = $('#' + id);
        
        $('.btn-nav.active').removeClass('active');
        $el.addClass('active');

        $('.block-content.active').removeClass('active');
        $content.addClass('active');
    }


    // ========================================================
    //  効果音の用意
    // ========================================================

    // ホバー音: sounds/hover.mp3、もしくはsounds/hover.ogg
    var hoverSE = new SE({
        basename: 'sounds/hover',
        onload: initListeners
    });

    // 決定音: sounds/enter.mp3、もしくはsounds/enter.ogg
    var enterSE = new SE({
        basename: 'sounds/enter',
        onload: initListeners
    });

    // ========================================================
    //  ボタンにイベントをセットする
    // ========================================================

    function initListeners () {
        // 音声のロードが終わっていない場合は中止
        // なおスマホの場合は、一度playを呼ぶまでロードはされないので
        // ひとまずloadされていない状態でも次へ進む
        if (!isSP && (!hoverSE.isLoaded || !enterSE.isLoaded)) {
            return;
        }


        // ========================================================
        //  クリックイベントで音を再生する・ページを切り替える
        // ========================================================

        // ボタンクリック時
        $btnNav.on('click', function (e) {
            e.preventDefault();

            // 既にアクティブなボタンだったら何もしない
            if ($(this).hasClass('active')) {
                return;
            }

            activatePage(this);

            // 決定時のSEを再生
            enterSE.ring();
        });

        // ボタンホバー時
        $btnNav.on('mouseover', function () {
            // 既にアクティブなボタンにホバーしても、何もしない
            if ($(this).hasClass('active')) {
                return;
            }

            // ホバー時の効果音を再生
            hoverSE.ring();
        });


        // ========================================================
        //  タッチイベントへの対応
        // ========================================================

        // ただ、touchstartとtouchmoveに音再生をひもづけた場合
        // →ボタンをなぞるたびに音が再生されてしまう
        /*
         $btnNav.on('touchstart, touchmove', function () {
         hoverSE.ring();
         });
         */

        // イベント自体は親要素に貼り付けて、
        // どのボタンをタッチしているかを後から取得、ページ切り替えが起きたら音再生
        $listNav.on('touchmove', function (e) {
            e.preventDefault();

            // タッチ位置から、その場所にあるボタンを取得
            var touch = e.originalEvent.touches[0];
            var el = document.elementFromPoint(touch.pageX, touch.pageY);

            if (!$(el).hasClass('btn-nav')) {
                // ボタンでない要素を取得していたら中止
                return;
            }

            if ($(el).hasClass('active')) {
                return;
            }

            activatePage(el);

            // ホバー時の効果音を再生
            hoverSE.ring();
        });
    }

    initListeners();
});
