
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
    // xhr:cc.loader.getXMLHttpRequest(),http://192.168.0.200:808
    GetCodeUrl:"/account/getcode"
  },
  //信息发射站
  SendMessages() {
    var xhr = cc.loader.getXMLHttpRequest()
    // console.log(this.Phone.string);
    // console.log(this.SecurityCode.string);
    // console.log(this.Messages.string);
    if (!this.Phone.string) {
      this.RedLabel.string = "请输入手机号"
    } else{
      if (verificationPhone(this.Phone.string) == false) {
        this.RedLabel.string = "请输入正确手机号"
      } else {
        console.log(verificationPhone(JSON.stringify({ mobilephone: this.Phone.string, signature:""})));
        this.streamXHREventsToLabel(xhr, "POST", this.GetCodeUrl, JSON.stringify({ mobilephone: this.Phone.string, signature:"D643A6FB5BF744E7BE518D88C11A1FE"}))
      }
    }
    
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
  },
  //net（xhr，木块，）
 
  streamXHREventsToLabel: function (xhr, method, url, data) {
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
        var response = xhr.responseText;
        // var fn = fn || function () { }
        // fn(response);
        console.log(response);
        return response;
      }
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send(data)
  },
  // net　end
  //   start() {}

  update(dt) {

  },
});
