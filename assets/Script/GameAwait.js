
import { GetUserDatas, GoLoadScene } from "GetUserData";
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
        Rule: cc.Node,
        //邀请
        SendAnInvitation: cc.Node,
        //在线人数
        OnlineNumber: cc.Node,
        // 围观
        CircuseeOnlookers: cc.Node,
        //充值按钮
        Recharge: cc.Node,
        //金币
        Gold: cc.Label,
        UserName: cc.Label,
        UserPic: cc.Node,
        UserID: cc.Label,
        ts: cc.Prefab,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //判断有没有账户
        GetUserDatas() ? '' : GoLoadScene("Home")
        let d = cc.sys.localStorage.getItem('SJ')
        if (d != null) {
            let ds = JSON.parse(decodeURIComponent(d))
            this.UserName.string = ds.UserName;
            this.UserID.string = "ID:" + ds.Login;
            this.Gold.string = ds.Balance
        } else {
            // GoLoadScene("Home")
        }

    },

    start() {
        console.log(this.Gold.string)
    },
    /**
     * 
     * @param {*} e 默认的event
     * @param {*} id 0是开始游戏 1是参观
     */
    startGame(e, id) {
        if (id == 0) {
            // if (this.Gold.string < 30) {
            //     let ts = cc.instantiate(this.ts);
            //     this.node.addChild(ts, 107);
            //     ts.setPosition(0, 0);
            //     return;
            // }
            //游戏匹配倒计时图
            // if (this.Gold.string > 9) {
            let Game = cc.instantiate(this.StartLayout);
            this.node.addChild(Game, 106);
            Game.setPosition(0, 0);
            let xhr = cc.loader.getXMLHttpRequest()
            console.log(Global.DataUsers.sToken)
            let _data = {
                Userid: Global.DataUsers.sUserId,
                Token: Global.DataUsers.sToken,
                Type: id
            }
            Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/caileigame/inroom", _data, e => {
              //匹配进入游戏
                console.log(e)
            })
            // }
        }
        if (id == 1) {
            //围观
        }
    },
    // update (dt) {},
});
