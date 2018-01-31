//Geolocation API を利用できるか確認する
if (navigator.geolocation) {
    // APIを利用出来る
    navigator.geolocation.getCurrentPosition(geoMap, altMap);
} else {
    // APIを利用出来ない
    altMap();
}

/**
 * GeoLocationの表示
 */
function geoMap(geo) {
    var coord = geo.coords;
    setGoogleMap(coord.latitude, coord.longitude);
};

/**
 * GeoLocationの代替処理
 */
function altMap() {
    //手動入力を有効にする
    $('#start').addClass('hide');
    $('#input').removeClass('hide');

    // ボタンクリックで、入力された緯度経度を取得
    $('#button').on('click', function (event) {
        var lat = $('#latitude').val();
        var lon = $('#longitude').val();
        lat = Number(lat);
        lon = Number(lon);

        if (isNaN(lat) === false && isNaN(lon) === false)
        {
            setGoogleMap(lat, lon);
        }
    });
};

/**
 * Google Map を表示する
 */
function setGoogleMap(lat, lng) {
    //地図を表示する
    $('#start').addClass('hide');
    $('#input').addClass('hide');
    $('#map').removeClass('hide');

    var point = new google.maps.LatLng(lat, lng);
    var mapOption = {
        center: point,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOption);

    //マーカーを設定する
    var markerOption = {
        position: point,
        map: map,
        draggable: true,
        animation: google.maps.Animation.BOUNCE
    };
    var marker = new google.maps.Marker(markerOption);
}
