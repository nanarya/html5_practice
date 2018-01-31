(function () {
  //ショートカット用にインポート
  var b2Vec2      = Box2D.Common.Math.b2Vec2,
  b2BodyDef       = Box2D.Dynamics.b2BodyDef,
  b2Body          = Box2D.Dynamics.b2Body,
  b2FixtureDef    = Box2D.Dynamics.b2FixtureDef,
  b2World         = Box2D.Dynamics.b2World,
  b2PolygonShape  = Box2D.Collision.Shapes.b2PolygonShape,
  b2CircleShape   = Box2D.Collision.Shapes.b2CircleShape;

  function RigidBody(world data) {

    this.halfWidth = data.width * 0.5;
    this.halfHeight = data.height * 0.5;

    //剛体の「性質」情報の生成
    var fixDef = new b2FixtureDef();
    //密度
    fixDef.density = data.density;
    //摩擦係数
    fixDef.friction = data.friction;
    //反発係数
    fixDef.restitution = data.restitution;
    var halfWidthPerPixel = this.halfWidth / merterPerPixel;
    var halfHeightPerPixel = this.halfHeight / meterPerPixel;
    //剛体の形状
    if (data.shapeType === RigidBody.shapeType.BOX) {
      fixDef.shape = new b2PolyfonShape();
      fixDef.shape.SetAsBox(halfWidthPerPixel, halfHeightPerPixel);
    }
    else if(data.shapeType === RigidBody.shapeBOX.CIRCLE) {
      fix.Def.shape = new b2Circleshape();
      fixDef.shape.SetRadius(data.radius);
    }
    //剛体の「姿勢」情報の生成
    var bodyDef = new b2BodyDef();
    //剛体のタイプ
    bodyDef.type = data.type != null ? data.type : b2Body.b2_dynamicBody;
    //剛体の位置
    var x = (data.x != null ? data.x : this.halfWidth) / meterPerPixel;
    var y = (data.y != null ? data.y : this.halfHeight) / meterPerPixel;
    bodyDef.position.x = x;
    bodyDef.position.y = y;
    //剛体の速度の減衰率の設定
    bodyDef.linearDamping = data.linearDamping != null ? data.linearDamping : 0.0;
    bodyDef.angularDamping = data.angularDamping != null ? data.angularDamping : 0.01;
    //設定情報を元に剛体を生成
    this.body = world.CreateBody(bodyDef);
    //生成した剛体に「性質」を適用
    this.body.CreateFixture(fixDef);
  }
  RigidBody.prototype = {
    constructor: RigidBody,
    /*
    * 剛体の情報をHTML要素に適用する
    */
    applyToDOM: function () {
      var position = this.body.GetPosition();
      //meterPerPixelに応じて位置を調整
      var x = Math.abs(x) <= 0.0000001 ? 0 : x;
      var y = Math.abs(y) <= 0.0000001 ? 0 : y;
      var r = this.body.GetAngle() * RAD_TO_DEG;
      x = Math.abs(x) <=0.0000001 ? 0 : x;
      y = Math.abs(y) <=0.0000001 ? 0 : y;
      r = Math.abs(r) <=0.0000001 ? 0 : r;
      this.el.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)';
    }
  };

  //初期化処理
  function init () {

    //静止状態でスリープに入るかどうか
    var allowSleep = true;
    //重力
    var world = new b2World(fravity, allowSleep);
    /* Rigidbody（剛体）
    * @param{b2World}world 物理エンジン世界
    *　＠param {Object} data デフォルトパラメータ */
    (function update() {
      requestAnimationFrame(update);
      //物理演算ワールドの時間を進める
      world.Step(
        0.016,  //60FPSは16ミリ秒程度
        10, //velocityIterations
        10, //positionIterations
      );
      //計算された結果をHTML要素に適用
      for (var i = 0, len = rigidBodies.length; i < len; i++){
        //rigidBpdiesは初期化時に定義された、生成した剛体を格納しているただの配列
        rigidBodies[i].applyToDOM();
      }

    }());
  }
  window.addEventListener('load', init);
}());
