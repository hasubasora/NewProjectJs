// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import { GetUserDatas, SignInBoxRight, AddWindow } from "GetUserData";
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
    },
    // 金币
    Gulds: {
      default: null,
      type: cc.Node
    },
    GuldsSetings: {
      default: null,
      type: cc.Prefab
    },
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
    //金币
    this.Gulds.on("touchstart", this.AddWindows, this);

    if (!cc.sys.localStorage.getItem('SJ') || GetUserDatas() == false) {
      SignInBoxRight(this.node, this.SignIn);
    } else {
      let d = cc.sys.localStorage.getItem('SJ')
      let ds = JSON.parse(decodeURIComponent(d))
      this.UserInfoName.string = ds.UserName;
      this.UserInfoId.string = "ID:" + ds.Login;
    }
  },
  Shops() {
    cc.director.loadScene("Shop");
  },
  ActivityWin() {
    cc.director.loadScene("Activity");
  },
  //游戏跳转
  directors(e, d) {
    if (GetUserDatas() == false) {
      SignInBoxRight(this.node, this.SignIn);
    }else{
      cc.director.loadScene(d);
    }
    console.log(d)

  },
  AddWindows() {
    AddWindow(this.node, this.GuldsSetings)
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

  start() { }

  // update (dt) {},
});
