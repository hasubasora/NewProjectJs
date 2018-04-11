// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import { SignInBoxLeft, DestroyNode } from "GetUserData";
cc.Class({
  extends: cc.Component,

  properties: {
    PhoneView: {
      default: null,
      type: cc.Prefab
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
  },
  //登陆框移动方法
  Wecher(){
   
  },
  Tel() {
    SignInBoxLeft(this.node, this.PhoneView)
    DestroyNode(this.node)
  },
  start() {}

  // update (dt) {},
});
