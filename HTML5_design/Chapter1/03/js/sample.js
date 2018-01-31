(function () {

    'use strict';

    /**
     * 1mに相当するpx
     */
    var meterPerPixel = 30;
    var RAD_TO_DEG = 180 / Math.PI;

    //対応しているプロパティ名を取得
    var transformProp = (function () {

        var style = document.createElement('div').style,
            prefix = [
                'transform',
                'webkitTransform',
                'mozTransform',
                'msTransform'
            ];

        for (var i = 0, l = prefix.length; i < l; i++) {
            if (prefix[i] in style) {
                return prefix[i];
            }
        }

        return 'transform';
    }());

    function defaultParam(data, defaults) {
        for (var key in defaults) {
            if (!data[key]) {
                data[key] = defaults[key];
            }
        }
    }

    //ショートカット用にインポート
    var b2Vec2          = Box2D.Common.Math.b2Vec2,
        b2BodyDef       = Box2D.Dynamics.b2BodyDef,
        b2Body          = Box2D.Dynamics.b2Body,
        b2FixtureDef    = Box2D.Dynamics.b2FixtureDef,
        b2World         = Box2D.Dynamics.b2World,
        b2PolygonShape  = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape   = Box2D.Collision.Shapes.b2CircleShape;

    /** Rigidbody（剛体）
     * @param {b2World} world 物理エンジン世界
     * @param {Object} data デフォルトパラメータ */
    function RigidBody(world, data) {

        //デフォルトパラメータを設定
        defaultParam(data, {
            density: 1.0,
            friction: 0.5,
            restitution: 0.2,
            shapeType: RigidBody.shapeType.BOX
        });

        if (data.shapeType === RigidBody.shapeType.CIRCLE) {
            data.width = data.height = data.radius * 2;
            data.radius = (data.radius || 1) / meterPerPixel;
        }

        /*! -------------------------------------------------------
            各種パラメータの保存
        ----------------------------------------------------------- */
        this.width  = data.width;
        this.height = data.height;
        this.halfWidth  = data.width * 0.5;
        this.halfHeight = data.height * 0.5;
        this.target = data.target;

        // 剛体の「性質」情報の生成
        var fixDef  = new b2FixtureDef();

        //密度
        fixDef.density = data.density;

        //摩擦係数
        fixDef.friction = data.friction;

        //反発係数
        fixDef.restitution = data.restitution;

        var halfWidthPerPixel  = this.halfWidth  / meterPerPixel;
        var halfHeightPerPixel = this.halfHeight / meterPerPixel;

        //剛体の形状
        if (data.shapeType === RigidBody.shapeType.BOX) {
            fixDef.shape = new b2PolygonShape();
            fixDef.shape.SetAsBox(halfWidthPerPixel, halfHeightPerPixel);
        }
        else if (data.shapeType === RigidBody.shapeType.CIRCLE) {
            fixDef.shape = new b2CircleShape();
            fixDef.shape.SetRadius(data.radius);
        }

        // 剛体の「姿勢」情報の生成
        var bodyDef = new b2BodyDef();

        //剛体のタイプ
        bodyDef.type = data.type != null ? data.type : b2Body.b2_dynamicBody;

        //剛体の位置
        var x = (data.x != null ? data.x : this.halfWidth)  / meterPerPixel;
        var y = (data.y != null ? data.y : this.halfHeight) / meterPerPixel;
        bodyDef.position.x = x;
        bodyDef.position.y = y;

        //剛体の速度の減衰率の設定
        bodyDef.linearDamping = data.linearDamping != null ? data.linearDamping : 0.0;
        bodyDef.angularDamping = data.angularDamping != null ? data.angularDamping : 0.01;

        //剛体適用要素が指定されいなければ生成する
        this.el = (data.el != null) ? data.el : document.createElement('div');

        //剛体のパラメータをDOMのパラメータに設定
        this.el.className += ' rigidbody';

        if (data.shapeType === RigidBody.shapeType.BOX) {
            this.el.style.width  = this.width  + 'px';
            this.el.style.height = this.height + 'px';
        }
        else if (data.shapeType === RigidBody.shapeType.CIRCLE) {
            this.el.style.height = this.el.style.width = (data.radius * 2 * meterPerPixel) + 'px';
            this.el.style.borderRadius = '50%';
        }

        //targetが指定されている場合はそこに追加
        this.target && this.target.appendChild(this.el);

        //設定情報を元に剛体を生成
        this.body = world.CreateBody(bodyDef);

        //生成した剛体に「性質」を適用
        this.body.CreateFixture(fixDef);
    }
    RigidBody.prototype = {
        constructor: RigidBody,

        /**
         * 剛体の情報をHTML要素に適用する
         */
        applyToDOM: function () {
            var position = this.body.GetPosition();

            //meterPerPixelに応じて位置を補正
            var x = position.x * meterPerPixel - this.halfWidth;
            var y = position.y * meterPerPixel - this.halfHeight;
            var r = this.body.GetAngle() * RAD_TO_DEG;

            x = Math.abs(x) <= 0.0000001 ? 0 : x;
            y = Math.abs(y) <= 0.0000001 ? 0 : y;
            r = Math.abs(r) <= 0.0000001 ? 0 : r;

            this.el.style[transformProp] = 'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)';
        }
    };

    /**
     * Static member
     */
    RigidBody.shapeType = {
        BOX: 'box',
        CIRCLE: 'circle'
    };


    /**
     * 初期化処理
     */
    function init() {

        //剛体管理用配列
        var rigidBodies = [];
        var target = document.getElementById('contents');

        //静止状態でスリープに入るかどうか
        var allowSleep = true;

        //重力
        var gravity = new b2Vec2(0, 9.8);

        //物理演算ワールドを生成
        var world = new b2World(gravity, allowSleep);

        //地面を生成
        var ground = new RigidBody(world, {
            target: target,
            type: b2Body.b2_staticBody,
            width: 1600,
            height: 20,
            x: 10,
            y: 460
        });
        rigidBodies.push(ground);

        //左の壁を生成
        var leftWall = new RigidBody(world, {
            target: target,
            type: b2Body.b2_staticBody,
            width: 10,
            height: 450,
            x: -5,
            y: 225
        });
        rigidBodies.push(leftWall);

        //右の壁を生成
        var rightWall = new RigidBody(world, {
            target: target,
            type: b2Body.b2_staticBody,
            width: 10,
            height: 450,
            x: 805,
            y: 225
        });
        rigidBodies.push(rightWall);

        var tagItems = document.querySelectorAll('.tag-cloud__tag-item');
        var cnt = tagItems.length;

        (function loop() {

            cnt--;

            if (cnt < 0) {
                return;
            }

            setTimeout(loop, 240);

            tagItems[cnt].style.display = 'block';
            var bit = new RigidBody(world, {
                el: tagItems[cnt],
                shapeType: RigidBody.shapeType.CIRCLE,
                radius: tagItems[cnt].offsetWidth / 2,
                x: Math.random() * 800,
                y: -80 - Math.random() * 200
            });

            bit.body.SetAngularVelocity(Math.random() * 10);
            rigidBodies.push(bit);
        }());

        //update
        (function update() {

            requestAnimationFrame(update);

            //物理演算ワールドの時間を進める
            world.Step(
                0.016, //60FPSは16ミリ秒程度
                10,    //velocityIterations
                10     //positionIterations
            );

            //計算された結果をHTMLに適用
            for (var i = 0, len = rigidBodies.length; i < len; i++) {
                //rigidBodiesは初期化時に定義された、生成した剛体を格納しているただの配列。
                rigidBodies[i].applyToDOM();
            }

            // world.DrawDebugData();
            world.ClearForces();

        }());
    }

    window.addEventListener('load', init);
}());
