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
      type: cc.Prefab
    },
    SignInTime: {
      default: null,
      type: cc.Number
    },
    UserInfo: {
      default: null,
      type: cc.Prefab
    },
    UserInfoImg: {
      default: null,
      type: cc.SpriteFrame
    },
    UserInfoId: {
      default: null,
      type: cc.Label
    },
    UserInfoName: {
      default: null,
      type: cc.Label
    },
    //用户信息
    InfoBox: {
      default: null,
      type: cc.Node
    },
    //设置
    Setings: {
      default: null,
      type: cc.Prefab
    },
    SetingsBtn: {
      default: null,
      type: cc.Node
    },
    //活动页面
    Activitys: {
      default: null,
      type: cc.Node
    },
    //商店
    ShopsBtn: {
      default: null,
      type: cc.Node
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // let InfoBox=this.getComponentInChildren("InfoBox");
    this.InfoBox.on("touchstart", this.UserInfos, this);
    // 设置
    this.SetingsBtn.on("touchstart", this.SetingsFn, this);
    //活动界面
    this.Activitys.on("touchstart", this.ActivityWin, this);
    //商店
    this.ShopsBtn.on("touchstart", this.Shops, this);

    // if (!this.UserInfoNames) {
    //   this.SignInBoxRight();
    // }
  },
  Shops() {
    cc.director.loadScene("Shop");
  },
  ActivityWin() {
    cc.director.loadScene("Activity");
  },
  directors(e,d){
    console.log(d)
    cc.director.loadScene(d);
  },
  UserInfos() {
    let Infos = cc.instantiate(this.UserInfo);
    this.node.addChild(Infos, 103);
    Infos.setPosition(0, 0);
  },
  SetingsFn() {
    let Infos = cc.instantiate(this.Setings);
    this.node.addChild(Infos, 104);
    Infos.setPosition(0, 0);
  },

  //登陆框移动方法
  SignInBoxRight() {
    let Logins = cc.instantiate(this.SignIn);
    this.node.addChild(Logins, 100);
    Logins.setPosition(-this.node.width, 0);
    // let ViewWidth = this.node.width / 2 + this.SignIn.width / 2;
    let SignInBox = cc.moveBy(0.2, cc.p(this.node.width, 0));
    Logins.runAction(SignInBox);
  },
  start() {}

  // update (dt) {},
});
