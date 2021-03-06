
import { verificationPhone } from "filters";
import { GetUserDatas, WeixinLoginTime } from "GetUserData";
cc.Class({
  extends: cc.Component,
  properties: {
    //用户手机号控件
    Phone: {
      default: null,
      type: cc.EditBox
    },
    //验证码控件
    SecurityCode: {
      default: null,
      type: cc.EditBox
    },
    // 短信验证码控件
    Messages: {
      default: null,
      type: cc.EditBox
    },


    RedLabel: cc.Label,
    GetImgCodes: cc.Sprite,
    //倒计时
    action_times: 60,
    TimesOutBtn: cc.Button,
    TimesOut: cc.Label,
    GetUserDataUrl: "/account/loginorregister",
    WebUrl: {
      default: null,
      type: cc.Sprite
    },
    SignWindow: cc.Node,

    LoginBtn: cc.Button,

    wxBtn: cc.Node,
    phoneBtn: cc.Node,
    webwxlogin: '',
    loadNode: cc.Node

  },
  RedLabels(str) {
    this.RedLabel.string = str
  },
  LoginList() {
    console.log('加载登陆表');
    let data = {}
    Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/account/GetLoginList", data, e => {
      let code = JSON.parse(e)
      console.log(code.mode);
      this.webwxlogin = code.webwxlogin
      if (code.code == 12000) {
        this.loadNode.scale = 0
        switch (code.mode) {
          case 1:
            this.wxBtn.scale = 1
            this.wxBtn.setPositionX(0)
            break;
          case 2:
            this.phoneBtn.scale = 1
            this.phoneBtn.setPositionX(0)
            break;
          case 3:
            this.phoneBtn.scale = 1
            this.wxBtn.scale = 1
            break;
          default:
            break;
        }
      } else {
        cc.sys.localStorage.removeItem('loginOut')
      }

    })
  },

  //信息发射站
  SendMessages(e, c) {
    var xhr = cc.loader.getXMLHttpRequest()
    if (!this.Phone.string) {
      this.RedLabels("请输入手机号")
    } else {
      if (verificationPhone(this.Phone.string) == false) {
        this.RedLabels("请输入正确手机号")
      } else {
        if (c == "code") {
          if (!this.SecurityCode.string) {
            this.RedLabels("请输入验证码")
            return;
          }
          let data = {
            "mobilephone": this.Phone.string,
            "imgcode": this.SecurityCode.string,
            "clientid": Global.clientid
          }
          Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/account/getcode", data, e => {
            let code = JSON.parse(e)
            if (code.code != 12000) {
              this.RedLabels(code.message)
              return;
            }
            if (code.code == 12000) {
              this.RedLabels(code.message)
              this.TimesOutBtn.interactable = false;
              this.SetTimeOut()
            }
          })
        }
        if (c == "sub") {
          if (!this.Messages.string) {
            this.RedLabels("请输入短信验证码");
            return;
          }
          let data = {
            "mobilephone": this.Phone.string,
            "vcode": this.Messages.string,
            "code": "",
          }
          Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/account/loginorregister", data, e => {
            let _e = JSON.parse(e)
            if (_e.code != 12000) {
              this.RedLabels(_e.message)
              return;
            }
            if (_e.code == 12000) {
              console.log('植入全局数据');
              Global.DataUsers = JSON.parse(JSON.stringify(_e.object)) //植入全局数据
              console.log(Global.DataUsers);
              cc.sys.localStorage.setItem("SJ", encodeURIComponent(JSON.stringify(_e.object)));
              GetUserDatas(1)
            }
          })
        }
      }
    }
  },
  TableChange() {
    if (this.Messages.string > 0 && this.Phone.string) {
      this.LoginBtn.interactable = true
    } else {
      this.LoginBtn.interactable = false
    }
  },

  // 倒数六十
  SetTimeOut() {
    this.t = function () {
      if (this.action_times < 1) {
        this.action_times = 60;
        this.TimesOut.string = "获取验证码"
        this.unschedule(this.t);
        this.TimesOutBtn.interactable = true;
      } else {
        // this.unschedule(this.t);
        // 这里的 this 指向 component
        let x = this.action_times - 1;
        this.TimesOut.string = x;
        this.action_times = x;
      }

    };
    this.schedule(this.t, 1);
  },

  CloseViews(e, num) {
    this.SignWindow.scale = num
  },
  getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  },
  onLoad() {
    // this.loadNode = cc.director.getScene().getChildByName('Canvas').getChildByName('Splash').scale

    console.log("/执行穿越模式/");
    this.WebUrlText()  //验证码
    if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
      //在微信中打开
      console.log('微信打开了');
      console.log(this.getQueryString('wxtoken'));
      // 存在的话直接跳进去
      if (this.getQueryString('wxtoken') != null) {
        //如果是退出的话
        console.log(cc.sys.localStorage.getItem('loginOut'));
        if (cc.sys.localStorage.getItem('loginOut')) {
          this.LoginList()  //登陆按钮配置
          return
        }
        WeixinLoginTime(this.getQueryString('wxtoken'))
        console.log('??');
        // cc.director.loadScene('Home')
      } else {
        this.LoginList()  //登陆按钮配置
      }
    } else {
      this.LoginList()  //登陆按钮配置
    }
    if (cc.sys.localStorage.getItem("SJ") != null) {
      GetUserDatas(1)
    }

  },
  wxBtnLogin() {
    cc.sys.localStorage.removeItem('loginOut')
    console.log(this.webwxlogin + '?cbUrl=' + encodeURIComponent(location.origin));
    // 'weixin://'
    // window.location.href = this.webwxlogin + '?cbUrl=' + encodeURIComponent(location.href.split("?")[0])
    window.location.href = this.webwxlogin + '?cbUrl=' + encodeURIComponent(location.origin)
  },
  // 换验证码
  WebUrlText() {
    var _this = this
    // console.log(Global.serverUrl + "/common/getimgcode")
    console.log(Global.serverUrl + "/common/getimgcode" + '?clientid=' + Global.clientid + '&t=' + Math.random());
    cc.loader.load({ url: Global.serverUrl + "/common/getimgcode" + '?clientid=' + Global.clientid + '&t=' + Math.random(), type: 'png' }, function (err, tex) {
      // console.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
      _this.WebUrl.spriteFrame.setTexture(tex);
    });
  },


});
