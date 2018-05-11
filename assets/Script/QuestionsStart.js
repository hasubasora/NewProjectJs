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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        Gold: cc.Label,
        UserName: cc.Label,
        UserPic: cc.Node,
        UserID: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.SetInfo()
    },
    SetInfo() {
        Global.getDataUsers()
        this.UserName.string = Global.DataUsers.sNickName;
        this.UserID.string = 'ID:' + Global.DataUsers.sLogin;
        this.Gold.string = Global.DataUsers.sBalance;
    },

    // ゲーム　スタート
    GameStart() {
        this.GetInroom()
    },
    //りんっぐ
    GetInroom() {
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.sUserId,
            Token: Global.DataUsers.sToken,
            ExamRoomID: 0
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/exam/inroom", _data, e => {
            let mid = JSON.parse(e)
            if (mid.code == 12000) {
                Global.questions = mid.Data
                console.log(Global.questions)
                cc.director.loadScene('Questions')
            }
        })

    },
    //积分池

    //游戏记录

    //规则

    //邀请

    // 音乐设置


    start() {

    },

    // update (dt) {},
});
