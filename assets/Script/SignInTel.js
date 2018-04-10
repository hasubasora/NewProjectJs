
import { verificationPhone } from "filters";

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
    CloseView: {
      default: null,
      type: cc.Node
    },
    RedLabel: cc.Label,
    GetImgCodes: cc.Sprite,
    //倒计时
    action_times: 60,
    TimesOutBtn: cc.Button,
    TimesOut: cc.Label,
    // xhr:cc.loader.getXMLHttpRequest(),http://192.168.0.200:808 http://192.168.0.114:819
    GetCodeUrl: "http://localhost:11072/account/getcode",
    SetUserUrl: "http://localhost:11072/account/loginorregister",
    WebUrl: cc.WebView,
    num:1
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
    if (!this.Messages.string) {
      this.RedLabels("请输入短信验证码")
    }

    if (!this.Phone.string) {
      this.RedLabels("请输入手机号")
    } else {
      if (verificationPhone(this.Phone.string) == false) {
        this.RedLabels("请输入正确手机号")
      } else {
        if (!this.SecurityCode.string) {
          this.RedLabels("请输入验证码")
        }else{
          if (c == "code") {
            let data = {
              "mobilephone": this.Phone.string,
              "imgcode": this.SecurityCode.string
            }
            // this.streamXHREventsToLabel(xhr, "POST", this.GetCodeUrl, JSON.stringify(data),e=>{})
            this.streamXHREventsToLabel(xhr, "POST", this.GetCodeUrl, data, e => {
              let code = JSON.parse(e)
              if (code.code == 12000) {
                this.TimesOutBtn.interactable = false;
                this.SetTimeOut()
              }
            })
          }
          if (c == "sub") {
            let data = {
              "mobilephone": this.Phone.string,
              "vscode": this.Messages.string,
              "code": "",
            }
            this.streamXHREventsToLabel(xhr, "POST", this.SetUserUrl, data, e => { })
            alert("这是提交按钮")
          }
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


    console.log(this.WebUrl.url + '?' + 1)

  },
  //net（xhr，木块，）
  // 换验证码
  WebUrlText() {
    this.WebUrl.url = this.WebUrl.url + '?' + 1
  },
  //确定提交信息
  streamXHREventsToLabel: function (xhr, method, url, _data, _fn) {
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
        var response = xhr.responseText;
        _fn(response) || function (response) { }
        // console.log(response);
      }
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

    xhr.send("data=" + JSON.stringify(_data))
  },
  // net　end
  //   start() {}

  update(dt) {

  },
});
