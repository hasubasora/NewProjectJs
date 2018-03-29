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
    //用户手机号控件
    Phone: {
      default: null,
      type: cc.Node
    },
    //验证码控件
    SecurityCode: {
      default: null,
      type: cc.Node
    },
    // 短信验证码控件
    Messages: {
      default: null,
      type: cc.Node
    },
    SubmitBtn: {
      default: null,
      type: cc.Node
    },
    CloseView: {
      default: null,
      type: cc.Node
    }
  },
  //信息发射站
  SendMessages() {
    console.log(this.Phone._components[0].string);
    console.log(this.SecurityCode._components[0].string);
    console.log(this.Messages._components[0].string);
  },
  // 关闭方式
  CloseViews() {
    var ViewWidth = this.node.parent.width / 2 + this.node.width / 2;
    var SignInBox = cc.moveBy(0.2, cc.p(ViewWidth, 0));
    this.node.runAction(SignInBox);
  },
  onLoad() {
    console.log("/执行穿越模式/");
    this.SubmitBtn.on("touchstart", this.SendMessages, this);
    this.CloseView.on("touchstart", this.CloseViews, this);
  }

  //   start() {}

  // update (dt) {},
});
