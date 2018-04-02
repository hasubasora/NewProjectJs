// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    Wechar: {
      default: null,
      type: cc.Node
    },
    Phone: {
      default: null,
      type: cc.Node
    },
    PhoneView: {
      default: null,
      type: cc.Prefab
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.Wechar.on("touchstart", this.SignInBoxLeft, this);
  },
  //登陆框移动方法
  SignInBoxLeft() {
     let PhoneViews = cc.instantiate(this.PhoneView);
     this.node.parent.addChild(PhoneViews, 101);
     PhoneViews.setPosition(this.node.parent.width, 0);
    // var ViewWidth = this.node.parent.width / 2 + this.PhoneView.width / 2;
    var SignInBox = cc.moveBy(0.2, cc.p(-this.node.parent.width, 0));
    PhoneViews.runAction(SignInBox);
  },
  start() {}

  // update (dt) {},
});
