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
        User_money: cc.Label,
        User_name: cc.Label,
        User_id: cc.Label,
        User_img: cc.Sprite,

        AllPoint: cc.Label,
        loseBox: cc.Node,

        MyList: cc.Node,
        AllList: cc.Node,
        Scroll1: cc.ScrollView,
        Scroll2: cc.ScrollView,

        TabDay: {
            default: [],
            type: cc.Toggle
        },
        Label0: cc.Label,
        Label1: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.User_name.string = Global.DataUsers.UserName;
        this.User_id.string = 'ID:' + Global.DataUsers.Login;
        this.User_money.string = Global.DataUsers.Balance;
        Global.loaderUserIcon(Global.DataUsers.UserIcon, this.User_img)
        Global._bollLoseBox = this.loseBox
        this.LoadPoint()
        this.LoadPointList(1)
        this.GameList()
    },
    MyListLoad(e, num) {
        this.MyList.scale = num
        if (num == 1) {
            this.GameList()
        }
    },
    AllListLoad(e, num) {
        this.AllList.scale = num
        if (num == 1) {
            this.LoadPointList(1)
        }
    },

    radioButtonClicked: function (toggle) {
        var index = this.TabDay.indexOf(toggle);
        switch (index) {
            case 0:
                this.LoadPointList(index)
                break;
            case 1:
                this.LoadPointList(index)
                break;
            default:
                this.LoadPointList(index)
                break;
        }
    },
    StatrGame() {
        this.node.scale = 0
    },
    //%.98资金池总记录
    LoadPoint() {
        var _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/BallSprint/GetLsTradeTotal", _data, e => {
            let _Object = JSON.parse(e)
            if (_Object.code = 12000) {
                this.AllPoint.string = _Object.totals
            }
        })
    },
    //%.97资金池记录
    LoadPointList(n) {
        this.Scroll1.content.removeAllChildren()
        var _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            Type: n
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/BallSprint/GetLsTradeTop", _data, e => {
            let _Object = JSON.parse(e)
            if (_Object.code = 12000) {
                if (n == 0) {
                    this.Label0.string = _Object.totals
                } else {
                    this.Label1.string = _Object.totals
                }
                for (const iterator of _Object.object) {
                    Global.loadPre('BollMyList', nodeList => {
                        let com = nodeList.getComponentsInChildren(cc.Label)
                        com[0].string = iterator.SortNum
                        com[1].string = iterator.UserName
                        com[2].string = iterator.WinGold
                        com[3].string = iterator.UserGold
                        Global.loaderUserIcon(iterator.Avatar, nodeList.getComponentsInChildren(cc.Sprite))
                        this.Scroll1.content.addChild(nodeList)
                    })
                }
                console.log(_Object);
            }
        })
    },
    //%.96游戏记录
    GameList() {
        this.Scroll2.content.removeAllChildren()
        var _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/BallSprint/GetLsUserBallTrade", _data, e => {
            let _Object = JSON.parse(e)
            if (_Object.code = 12000) {
                for (const iterator of _Object.object) {
                    Global.loadPre('BollMyList', nodeList => {
                        let com = nodeList.getComponentsInChildren(cc.Label)
                        com[0].string = iterator.TradeId
                        com[1].string = iterator.EndTime
                        com[2].string = iterator.WinGold
                        com[3].string = iterator.Times
                        this.Scroll2.content.addChild(nodeList)
                    })
                }
            }
        })
    }
    // update (dt) {},
});
