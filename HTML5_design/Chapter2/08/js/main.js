(function($){

    'use strict';

    var cv = document.getElementById('fileCv'),
        ctx = cv.getContext('2d'),
        W, // canvasのwidth
        H, // canvasのheight
        dataURL,
        defaultImageData,
        defaultData; // ファイルをアップロードした時用のデータ

    $(document).ready(function(){
        init();
    });

    /**********************************************
     *  初期設定
     **********************************************/
    function init(){

        // 画像をアップロードする
        $('#upload').on('change', upload);

        // ragioボタン実行するエフェクトを切り替える
        $('input[name="effect"]:radio').on('change', function(e){
            switchRadio(e.currentTarget.value);
        });

        // スライダーが変化したら、明暗を操作する
        $("#briteness").on('slidechange', function(event, ui) {
            briteness(ui);
        });

        // canvasに描画したimageデータをファイルとして保存する
        $('#save').on('click', saveImg);
    }

    /**********************************************
     *  デフォルトのデータを取得
     **********************************************/
    function setDefaultCxData (){
        defaultImageData = ctx.getImageData(0, 0, W, H);
        defaultData      = defaultImageData.data;
    }


    /**********************************************
     *  フォームでアップされたファイルをcanvasに描画
     **********************************************/
     function drawFile(){
        var imageFile = new Image();

        if(dataURL){
            imageFile.src = dataURL;

            W = cv.width = imageFile.width;
            H = cv.height = imageFile.height;

            imageFile.onload = function(){
                ctx.clearRect(0, 0, W, H);
                ctx.drawImage(imageFile, 0, 0);
                setDefaultCxData();
            };
        }
    }

    /**********************************************
     *  switch effect
     **********************************************/
    function switchRadio(value){

        var imageData = ctx.getImageData(0, 0, W, H),
            data = imageData.data;

            console.log(imageData);

        switch(value){
            case 'reset':
                drawFile();
                break;
            case 'monochrome':
                monochrome(data);
                break;
            case 'sepia':
                sepia(data);
                break;
            case 'reverse':
                reverse(data);
                break;
            default:
                break;
        }

        ctx.putImageData(imageData, 0, 0);
    }


    /**********************************************
     *  file upload
     **********************************************/
    function upload(){

        if (window.File) {
            var reader = new FileReader(),
                file   = this.files[0];

            // ファイルがない場合はここで関数を抜ける
            if (!this.files.length) {
                return;
            }
            // ファイルが画像データではない場合はここを抜ける
            if(!file.type.match(/image\/\w+/)){
                alert('画像ファイルのみを選択してください。');
                return;
            }

            // fileをData URLに変換
            reader.readAsDataURL(file);

            reader.onload = function(e){
                dataURL = e.target.result;
                drawFile();
            };
        }
        else {
            alert('File APIに対応していないブラウザです。');
        }
    }

    /**********************************************
     *  gray effect
     **********************************************/
    function monochrome(data){
        var r,
            g,
            b,
            grayScale;

        for(var i = 0, n = data.length; i < n; i+=4){

            //赤・緑・青のデータを取得（今回透過率は変更しません）。
            r = data[i];
            g = data[i+1];
            b = data[i+2];

            //グレースケール化
            grayScale = parseInt(( r*30 + g*59 + b*11 ) / 100);

            // red
            data[i] = grayScale;
            // green
            data[i + 1] = grayScale;
            // blue
            data[i + 2] = grayScale;
        }
    }

    /**********************************************
     *  gray effect
     **********************************************/
    function color(data){
        var r,
            g,
            b;

        for(var i = 0, n = data.length; i < n; i+=4){

            //赤・緑・青のデータを取得（今回透過率は変更しません）。
            r = data[i];
            g = data[i+1];
            b = data[i+2];

            // red
            data[i] += 20;
            // green
            data[i + 1] -= 10;
            // blue
            data[i + 2] += 30;
        }
    }

    /**********************************************
     *  sepia effect
     **********************************************/
    function sepia(data){
        var r,
            g,
            b,
            grayScale;

        for(var i = 0, n = data.length; i < n; i+=4){

            //赤・緑・青のデータを取得（今回透過率は変更しません）。
            r = data[i];
            g = data[i+1];
            b = data[i+2];

            // 一旦グレースケール化
            grayScale = parseInt(( r*30 + g*59 + b*11 ) / 100);

            // red
            data[i] = (grayScale/255)*290;
            // green
            data[i+1] = (grayScale/255)*200;
            // blue
            data[i+2] = (grayScale/255)*145;
        }

    }

    /**********************************************
     *  reverse effect
     **********************************************/
    function reverse(data){

        for(var i = 0, n = data.length; i < n; i+=4){
            // Red
            data[i] = 255-data[i];
            // Green
            data[i + 1] = 255-data[i+1];
            // Nlue
            data[i + 2] = 255-data[i+2];
        }
    }

    /**********************************************
     *  briteness effect
     **********************************************/
    function briteness(ui){
        var britenessVal = ui.value,
            newImageData = ctx.createImageData(W, H),
            newData = newImageData.data;

        for(var i = 0, n = defaultData.length; i < n; i+=4){

            if( defaultData[i] !== 0 ){
            // Red
            newData[i]   = defaultData[i]   + ( 255 * britenessVal);
            // Green
            newData[i+1] = defaultData[i+1] + ( 255 * britenessVal);
            // Blue
            newData[i+2] = defaultData[i+2] + ( 255 * britenessVal);
            newData[i+3] = 255;
            }
        }
        ctx.putImageData( newImageData, 0, 0);
    }

    /**********************************************
     *  画像を保存する
     **********************************************/
    function saveImg(){
        var a = document.createElement('a');

        a.href = cv.toDataURL();
        a.download = 'result.png'; //ファイル名を決める
        a.click();
    }


})(jQuery);