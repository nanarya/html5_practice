(function () {

    "use strict";

    var fps = 30;
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return setTimeout(callback, 1000 / fps);
        };
    var cancelAnimationFrame = window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function (intervalID) {
            return clearTimeout(intervalID);
        };
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;

    var canvas, ctx, assets, render, animate, resizeCanvas, Vec2, Snow, createSnow,
        updateWind, wind, Smoke, houses, createSmokeOnHouse;

    canvas = $('.snow-canvas')[0];
    ctx = canvas.getContext('2d');

    assets = [];

    resizeCanvas = function () {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    };

    render = function () {
        var i;

        for (i = 0; i < assets.length; i++) {
            assets[i].update();
            assets[i].draw();
        }
    };

    animate = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        render();

        return requestAnimationFrame(animate);
    };

    Vec2 = function (x, y) {
        this.x = x;
        this.y = y;
    };

    Vec2.prototype.add = function (vec) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    };

    Vec2.prototype.mulScl = function (scl) {
        return new Vec2(this.x * scl, this.y * scl);
    };

    Snow = function (opt) {
        this.radius = opt.radius || 1;
        this.position = opt.position || new Vec2(0, 0);
        this.speed = opt.speed || new Vec2(0, 0);
    };

    Snow.create = function(amount) {
        var i;

        for (i = 0; i < amount; i++) {
            assets.push(new Snow({
                radius: Math.random() * 2,
                position: new Vec2(Math.random() * canvas.width, Math.random() * canvas.height - canvas.height),
                speed: new Vec2(0, Math.random() * -1.5 + 1.6)
            }));
        }
    };

    Snow.prototype.update = function () {
        var speed = this.speed.add(wind.mulScl(1 / this.radius / 2));
        this.position = this.position.add(speed);

        if (this.position.y > canvas.height) {
            this.position = new Vec2(Math.random() * canvas.width, Math.random() * canvas.height - canvas.height);
        }
    };

    Snow.prototype.draw = function () {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();

        ctx.shadowBlur = this.radius * 2;
        ctx.shadowColor = '#fff';
        ctx.fillStyle = '#fff';
        ctx.fill();

        ctx.restore();
    };

    Smoke = function (opt) {
        this.scale = opt.scale || 1;
        this.position = opt.position || new Vec2(0, 0);
        this.wave = 0;
        this.startX = this.position.x;
        this.isOutOfRange = false;
    }

    Smoke.factoryTimer = null;

    Smoke.create = function(x, y) {
        assets.push(new Smoke({
            scale: Math.random() * 1 + 0.5,
            position: new Vec2(x, y)
        }))

        Smoke.factoryTimer = setTimeout(function() {
            Smoke.create(x, y);
        }, 800);
    };

    Smoke.stop = function () {
        clearTimeout(Smoke.factoryTimer);
        Smoke.factoryTimer = null;
    };

    Smoke.prototype.texture = new Image();
    Smoke.prototype.speed = new Vec2(0, -1);
    Smoke.prototype.isTexReady = false;

    Smoke.prototype.texture.src = 'images/smoke.png'
    Smoke.prototype.texture.onload = function () {
        Smoke.prototype.isTexReady = true;
    };

    Smoke.prototype.update = function () {
        var x, y;

        if (this.isOutOfRange) return;

        this.wave++;

        x = 20 * this.scale * Math.sin(this.wave / 10) + this.startX;
        y = this.position.y + this.speed.y;

        this.position = new Vec2(x, y);

        if (this.position.y < -50) {
            this.isOutOfRange = true;
        }
    };

    Smoke.prototype.draw = function () {
        if (!this.isTexReady || this.isOutOfRange) return;

        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.scale(this.scale, this.scale);
        ctx.drawImage(this.texture, -25, -25);

        ctx.restore();
    };

    updateWind = function(e) {
        var x = e.clientX / canvas.width * 2 - 1;

        return wind = new Vec2(x, 0);
    };

    createSmokeOnHouse = function (e) {
        var x, y;

        x = $(this).offset().left + 100;
        y = $(this).offset().top + ($(this).parent().hasClass('floor-1') ? 60 : 10);

        Smoke.stop();
        Smoke.factoryTimer = setTimeout(function() {
            Smoke.create(x, y);
        }, 1280);
    };

    houses = $('.floor-1 .house, .floor-2 .house');
    houses.on('mouseover', createSmokeOnHouse)
        .on('mouseout', Smoke.stop);

    wind = new Vec2(0, 0);
    $(canvas).on('mousemove', updateWind);

    $(window).on('resize', resizeCanvas);
    resizeCanvas();
    Snow.create(200);
    animate();

}).call(this);
