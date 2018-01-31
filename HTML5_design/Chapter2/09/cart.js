$('.item').draggable({
    helper: 'clone',
    opacity: 0.8,
    revert: 'invalid',
    revertDuration: 200
});

var total = 0;

$('#cart').droppable({
    activeClass: 'active',
    drop: function(event, ui) {
        //ドロップされた要素を複製する
        $('.list', this).append(ui.draggable.clone());
        //合計金額を追記する
        total += ui.draggable.data('price');
        //金額カンマを挿入
        var sum = String(total).replace(/(\d)(\d{3})$/, '$1,$2');
        $('.total', this).html(sum + '円');
    }
});
