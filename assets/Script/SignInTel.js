
import { verificationPhone } from "filters";
import { GetUserDatas } from "GetUserData";
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
    SubmitBtn: {
      default: null,
      type: cc.Node
    },

    RedLabel: cc.Label,
    GetImgCodes: cc.Sprite,
    //倒计时
    action_times: 60,
    TimesOutBtn: cc.Button,
    TimesOut: cc.Label,
    // xhr:cc.loader.getXMLHttpRequest(),
    GetCodeUrl: Global.serverUrl + "/account/getcode",
    SetUserUrl: Global.serverUrl + "/account/loginorregister",
    GetUserDataUrl: Global.serverUrl + "/account/loginorregister",
    WebUrl: {
      default: null,
      type: cc.Sprite
    },
    //返回登录选择
    SignInBox: cc.Prefab
  },
  RedLabels(str) {
    this.RedLabel.string = str
  },

  //信息发射站
  SendMessages(e, c) {
    var xhr = cc.loader.getXMLHttpRequest()
    // console.log(this.Phone.string);
    // console.log(this.SecurityCode.string);
    // console.log(this.Messages.string);

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
            "imgcode": this.SecurityCode.string
          }

          Global.streamXHREventsToLabel(xhr, "POST", this.GetCodeUrl, data, e => {
            let code = JSON.parse(e)
            if (code.code!=12000) {
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
          Global.streamXHREventsToLabel(xhr, "POST", this.SetUserUrl, data, e => {
            let _e = JSON.parse(e)
            if (_e.code != 12000) {
              this.RedLabels(_e.message)
              return;
            }
            if (_e.code == 12000) {
              let background = this.node.parent.getChildByName('background')
              let InfoBox = cc.find("top/InfoBox", background)
              InfoBox.getComponentsInChildren(cc.Label)[0].string = _e.object.NickName;       //名字
              InfoBox.getComponentsInChildren(cc.Label)[1].string = "ID:" + _e.object.Login;  //id
              let pay = cc.find("top/pay", background)
              pay.getComponentInChildren(cc.Label).string = _e.object.Balance;                //金币
              console.log(_e.object)
              // Global.DataUsers=_e.object //植入全局数据
              this.node.parent.getChildByName('SignIn').destroy()
              this.node.destroy()
              cc.sys.localStorage.setItem("SJ", encodeURIComponent(JSON.stringify(_e.object)));
              GetUserDatas()
            }
          })
        }
      }
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


  // 关闭方式（暂时没用）
  CloseViews() {
    this.node.destroy()
    // 因为不是父节点所有还没成

  },
  onLoad() {
    console.log("/执行穿越模式/");
    this.SubmitBtn.on("touchstart", this.SendMessages, this);
    // let background = this.node.parent.getChildByName('background')
    // let find = cc.find("top/InfoBox", background)
    // let U_name = find.getComponentInChildren(cc.Label).string
    // console.log(find.getComponentsInChildren(cc.Label))
    this.WebUrlText()
  },
  //net（xhr，木块，）
  // 换验证码
  WebUrlText() {
    var _this = this
    // console.log(Global.serverUrl + "/common/getimgcode")
    cc.loader.load({ url: Global.serverUrl + "/common/getimgcode" + '?' + Math.random(), type: 'png' }, function (err, tex) {
      // console.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
      _this.WebUrl.spriteFrame.setTexture(tex);
    });
  },

  update(dt) {

  },
});
