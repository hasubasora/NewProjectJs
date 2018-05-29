// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
// import { GetPrefab } from "GetUserData";
cc.Class({
  extends: cc.Component,

  properties: {
    // PhoneView: {
    //   default: null,
    //   type: cc.Prefab
    // }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
  },
  //登陆框移动方法
  Wecher() {
    console.log('微信登陆s')
  },

  Tel() {
    // console.log(this.node.parent.height)
    // let PhoneViews = cc.instantiate(this.PhoneView);
    // this.node.parent.addChild(PhoneViews, 101);
    // PhoneViews.setPosition(this.node.parent.width, 0);
    // // var ViewWidth = this.node.parent.width / 2 + this.PhoneView.width / 2;
    // var SignInBox = cc.moveBy(0.2, cc.p(-this.node.parent.width, 0));
    // PhoneViews.runAction(SignInBox);

    this.GetPrefab('SignInTel')
  },
  start() { },
  GetPrefab(fab) {
    cc.loader.loadRes("/prefab/" + fab, (err, Prefab) => {
      if (err) {
        console.log(err)
        return;
      }
      var newNode = cc.instantiate(Prefab);
      // console.info(this.node)
      newNode.setPosition(this.node.width / 2, this.node.height / 2);
      cc.director.getScene().addChild(newNode);
      // let _newNode = cc.find("sl/winText", newNode)
      // _newNode.getComponentsInChildren(cc.Label)[0].string = gold;
    });
  },
  // update (dt) {},
});
