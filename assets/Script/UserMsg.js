import { GetUserDatas } from "GetUserData";
cc.Class({
    extends: cc.Component,

    properties: {
        UserName: cc.Label,
        UserId: cc.Label,
        UserAddress: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        GetUserDatas()
        this.UserName.string = Global.DataUsers.sNickName
        this.UserId.string = "ID:" + Global.DataUsers.sLogin
        // this.UserName.UserAddress = Global.DataUsers.sUserId
    },

    start() {

    },

    // update (dt) {},
});