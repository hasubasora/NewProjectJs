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
    //登陆 ローク
    SignIn: {
      default: null,
      type: cc.Node
    },
    SignInTime: {
      default: null,
      type: cc.Number
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.SignInBoxRight();
  },
  //登陆框移动方法
  SignInBoxRight() {
    var ViewWidth = this.node.width / 2 + this.SignIn.width / 2;
    var SignInBox = cc.moveBy(0.2, cc.p(ViewWidth, 0));
    this.SignIn.runAction(SignInBox);
  },
  start() {}

  // update (dt) {},
});
