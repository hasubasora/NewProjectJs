
import { GetUserDatas, GoLoadScene, LoginTimeOut } from "GetUserData";
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
    onLoad() {
        //判断有没有账户
        this.SetInfo()
        GetUserDatas()
    },
    SetInfo() {
        Global.getDataUsers()
        this.UserName.string = Global.DataUsers.sNickName;
        this.UserID.string = 'ID:' + Global.DataUsers.sLogin;
        this.Gold.string = Global.DataUsers.sBalance;
    },
    /**
     * 
     * @param {*} e 默认的event
     * @param {*} id 0是开始游戏 1是参观
     */
    startGame(e, id) {
        if (this.Gold.string < 30) {
            let ts = cc.instantiate(this.ts);
            this.node.addChild(ts, 107);
            ts.setPosition(0, 0);
            return;
        }
        //游戏匹配倒计时图
        if (this.Gold.string > 9) {
            // let Game = cc.instantiate(this.StartLayout);
            // this.node.addChild(Game, 106);
            // Game.setPosition(0, 0);

            let xhr = cc.loader.getXMLHttpRequest()
            let _data = {
                Userid: Global.DataUsers.sUserId,
                Token: Global.DataUsers.sToken,
                Type: id
            }
            Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/caileigame/inroom", _data, e => {
                //匹配进入游戏
                console.log('匹配进入游戏')
                let _GoToGame = JSON.parse(e);
                Global._StageData = _GoToGame
                if (_GoToGame.code != 12000) {
                    LoginTimeOut(Global._StageData.code)
                } else {
                    GoLoadScene("Stage")
                }
            })
        }
    },
    // update (dt) {},
});
