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
    Gold: cc.Label,
    Audios: cc.AudioSource,

    loginBox: cc.Node,
    telLoginBox: cc.Node,
    telLogin: cc.Node,
    TurnTheScreen: cc.Node,

    screenOrientation: '',
    sMsg: cc.Label
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // document.body.style.position='fixed'
    // document.getElementById('GameCanvas').height=375
    // 添加事件监听
    // addEventListener('load',  ()=> {
    this.addEventListeners();
    // });
    // let InfoBox=this.getComponentInChildren("InfoBox");
    this.InfoBox.on("touchstart", this.UserInfos, this);
    // 设置
    this.SetingsBtn.on("touchstart", this.SetingsFn, this);
    //活动界面
    this.Activitys.on("touchstart", this.ActivityWin, this);
    //金币
    this.Gulds.on("touchstart", this.AddWindows, this);
    //音乐初始化
    Global.Audios = this.Audios;
    Global.Audios.volume = cc.sys.localStorage.getItem("Mic");
    //判断有没有账户
    // GetUserDatas() ? this.SetInfo() : SignInBoxRight(this.node, this.SignIn);
    GetUserDatas() ? this.SetInfo() : this.loginBox.scale = 1;
  },
  addEventListeners() {
    this.checkOrient();
    window.onorientationchange = this.screenOrientation;
  },


  //通过window.orientation来判断设备横竖屏
  checkOrient() {
    let _this = this
    if (window.orientation == 0 || window.orientation == 180) {//竖屏的时候
      this.screenOrientation = 'portrait';
      // alert(window.orientation)
      _this.TurnTheScreen.scale = 1
    }
    else if (window.orientation == 90 || window.orientation == -90) {//横屏的时候
      this.screenOrientation = 'landscape';
      _this.TurnTheScreen.scale = 0
      // alert(window.orientation)
    }
  },
  SignInBox() {
    this.loginBox.scale = 0
    this.telLoginBox.scale = 1
  },
  closeSignInBoxPhone() {
    this.loginBox.scale = 1
    this.telLoginBox.scale = 0
  },


  SetInfo() {
    Global.getDataUsers()
    this.UserInfoName.string = Global.DataUsers.sUserName;
    this.UserInfoId.string = 'ID:' + Global.DataUsers.sLogin;
    this.Gold.string = Global.DataUsers.sBalance;

  },
  Shops() {
    cc.director.loadScene("Shop");
  },
  ActivityWin() {
    cc.director.loadScene("Activity");
  },
  //游戏跳转
  directors(e, d) {
    if (GetUserDatas()) {
      cc.director.loadScene(d);
    } else {
      this.loginBox.scale = 1;
    }

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
  //SignIn
  GetPrefab(fab) {
    cc.loader.loadRes("/prefab/" + fab, (err, Prefab) => {
      if (err) {
        console.log(err)
        return;
      }
      var newNode = cc.instantiate(Prefab);
      newNode.setPosition(this.node.width / 2, this.node.height / 2);
      cc.director.getScene().addChild(newNode);
      // let _newNode = cc.find("sl/winText", newNode)
      // _newNode.getComponentsInChildren(cc.Label)[0].string = gold;
    });
  },
  //手機的登陸
  SetSignInPhone() {
    this.GetPrefab('SignInTel')
  },
  CloseViews() {
    this.node.destroy()
  },
  start() {

  }
  ,
  GoToMsg() {
    cc.director.loadScene("News");
  },
  update(dt) {
    this.sMsg.string = Global.socketMsg
  },
});
