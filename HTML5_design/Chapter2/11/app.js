(function(window, document) {

'use strict';

var ctx = $('canvas').get(0).getContext('2d');

function setMode(mode) {
    switch (mode) {
        case 'pen' :
            ctx.globalCompositeOperation = 'source-over';
            break;
        case 'eraser' :
            ctx.globalCompositeOperation = 'destination-out';
            break;
        default :
            break;
    }
    
    $('body').attr('data-mode', mode);
}
function setSize(size) {
    switch(size) {
        case 'small' :
            ctx.lineWidth = 5;
            break;
        case 'medium' :
            ctx.lineWidth = 20;
            break;
        case 'large' :
            ctx.lineWidth = 40;
            break;
        default :
            break;
    }
    
    $('body').attr('data-size', size);
}
function setColor(color) {
    ctx.strokeStyle = color;
    
    $('.sample').css('backgroundColor', color);
}
function handleMouseDown(evt) {
    ctx.beginPath();
    ctx.moveTo(evt.pageX, evt.pageY);
    
    $(document).bind('mousemove', handleMouseMove);
    $(document).bind('mouseup', handleMouseUp);
}
function handleMouseMove(evt) {
    ctx.lineTo(evt.pageX, evt.pageY);
    ctx.stroke();
}
function handleMouseUp() {
    $(document).unbind('mousemove', handleMouseMove);
    $(document).unbind('mouseup', handleMouseUp);
}
function handleModeClick() {
    setMode($(this).data('mode'));
}
function handleSizeClick() {
    setSize($(this).data('size'));
}
function handleColorClick() {
    setColor($(this).data('color'));
}

$(document).bind('mousedown', handleMouseDown);
$(document).delegate('.mode', 'click', handleModeClick);
$(document).delegate('.size', 'click', handleSizeClick);
$(document).delegate('.color', 'click', handleColorClick);

setMode('pen');
setSize('small');
setColor('#000');
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

}(this, document));