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
        //开始按钮
        StartSp: {
            default: null,
            type: cc.Button
        },
        //开始加入资源
        StartLayout: {
            default: null,
            type: cc.Prefab
        },
        //参加记录
        Record: cc.Node,
        //规则
        Rule : cc.Node,
        //邀请
        SendAnInvitation: cc.Node,
        //在线人数
        OnlineNumber: cc.Node,
        // 围观
        CircuseeOnlookers: cc.Node,
        //充值按钮
        Recharge: cc.Node,
        //金币
        Gold: cc.Node,
        UserName: cc.Node,
        UserPic: cc.Node,
        UserID:cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    startGame() {
        let Game = cc.instantiate(this.StartLayout);
        this.node.addChild(Game, 106);
        Game.setPosition(0, 0);
    },
    // update (dt) {},
});
