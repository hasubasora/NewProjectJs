// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import { GetUserDatas } from 'GetUserData'
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
        // 余额不足
        moneyEnough: cc.Node,
        ClientLog: cc.Node,
        Regulation: cc.Node,
        RankingList: cc.Node,
        RankingLists: cc.ScrollView,
        GameLists: cc.ScrollView,
        misNumber: 0,
        misWindow: cc.Node,  //答题卡
        ViewWeb: cc.WebView,

        datingMis: cc.AudioSource,
        ipst: true
    },

    // LIFE-CYCLE CALLBACKS:
    datingMiss() {
        if (this.ipst) {
            this.ipst = !this.ipst
            this.datingMis.play()
        } else {
            this.datingMis.stop()
            this.ipst = !this.ipst
        }
    },
    onLoad() {
        this.SetInfo()

    },
    SetInfo() {
        GetUserDatas()
        this.UserName.string = Global.DataUsers.UserName;
        this.UserID.string = 'ID:' + Global.DataUsers.Login;
        this.Gold.string = Global.DataUsers.Balance;
        this.getView()

        this.loaderUserIcon(Global.DataUsers.UserIcon, this.UserPic)
        this.ClientLogs()
        this.regulations()
        this.GetlsexamprofitrankingInfo()
        this.getvouchernumber()
    },
    closeMoneyEnough() {
        this.moneyEnough.scale = 0
    },
    // ゲーム　スタート
    GameStart() {
        if (this.Gold.string < 100) {
            this.moneyEnough.scale = 1
            return
        }

        if (this.misNumber != 0) {
            this.misWindow.scale = 1
            return
        }
        this.GetInroom(0)
    },
    closemisWindow() {
        this.misWindow.scale = 0
    },
    //积分卡
    getvouchernumber() {
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/exam/getvouchernumber", _data, e => {
            let mid = JSON.parse(e)
            if (mid.code == 12000) {
                this.misNumber = mid.Number
            }
        })
    },
    //りんっぐ
    GetInroom(e, sms) {
        console.log(sms);

        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            ExamRoomID: 0,
            IsAnswerSheet: sms  //是否使用答题卡（0:否，1：是）
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
    ClientLogs() {
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            ExamRoomID: 0
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/exam/getexamgamerecords", _data, e => {
            let mid = JSON.parse(e)
            if (mid.code == 12000) {
                console.log(mid.object)
                mid.object.forEach((element, index) => {
                    // console.log((index % 2));
                    // console.log('排位-' + index);

                    this.loaderFab(element, (index % 2), index)
                });
            }
        })
    },
    loaderFab(mo, index, idx) {

        var newNode, rangLabel, timeLabel, moneyLabel, moneysLabel
        cc.loader.loadRes("/prefab/Sprite2", (err, fab) => {
            if (err) {
                console.log(err);
                return;
            }
            newNode = cc.instantiate(fab);
            // console.log(index);
            // console.log('排位' + idx);

            if (index == 0) {
                // console.log('index');
                this.loadRes(newNode)
            }
            rangLabel = newNode.getChildByName('rangLabel');
            moneysLabel = newNode.getChildByName('moneysLabel');
            moneyLabel = newNode.getChildByName('moneyLabel');
            timeLabel = newNode.getChildByName('timeLabel');
            moneysLabel.getComponent(cc.Label).string = mo.RecyclingAmount
            rangLabel.getComponent(cc.Label).string = mo.Ranking
            moneyLabel.getComponent(cc.Label).string = mo.TradesAmount
            timeLabel.getComponent(cc.Label).string = this.getDate(mo.ExitTime * 1000)
            this.GameLists.content.addChild(newNode)
        });
    },
    // getDate(date) {
    //     var t = new Date(date).toLocaleString();
    //     return t;
    // },
    getDate(date1) {
        // 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
        var date = new Date(date1);
        let Y = date.getFullYear() + '-',
            M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
            D = date.getDate(),
            h = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();
        return (Y + M + D + ' ' + this.minutes(h) + ':' + this.minutes(m) + ':' + this.minutes(s))
        // 输出结果：2014-04-23 18:55:49
    },
    minutes(h) {
        let _s = h + ''
        if (_s.length == 1) {
            let _h = '0' + _s
            return _h
        } else {
            return _s
        }
    },
    loadRes(newNode) {
        cc.loader.loadRes("/Qus/bg2", function (err, spriteFrame) {
            if (err) {
                console.log(err);
                return;
            }
            newNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spriteFrame);
        });
    },
    //加载网络资源
    loaderUserIcon(mo, RanSprite) {
        cc.loader.load(mo, function (err, tex) {
            if (err) {
                console.log(err);
                return;
            }
            // RanSprite.getComponent(cc.sprite).spriteFrame.setTexture(tex);
            RanSprite.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
        });
    },
    //规则
    regulations() {
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            ExamRoomID: 0
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/exam/getexamruleinfo", _data, e => {
            let mid = JSON.parse(e)
            if (mid.code == 12000) {
                console.log(mid.object)
            }
        })
    },
    //邀请

    // 音乐设置
    winClose(e, num) {
        this.ClientLog.scale = num
    },
    winClose2(e, num) {
        this.Regulation.scale = num
    },
    winClose3(e, num) {
        this.RankingList.scale = num
        if (num == 1) {
            this.GetlsexamprofitrankingInfo()
        }
    },
    GetlsexamprofitrankingInfo() {
        this.RankingLists.content.removeAllChildren()
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/exam/getlsexamprofitrankingInfo", _data, e => {
            let mid = JSON.parse(e)
            if (mid.code == 12000) {
                // console.log(mid.object)
                mid.object.forEach((element, index) => {
                    this.loaderRaing(element, (index % 2), index)
                });
            }
        })
    },
    loaderRaing(mo, index, idx) {
        var newNode, rang, timeLabel, moneyLabel, name
        console.log(index);
        // console.log('排位' + idx);
        cc.loader.loadRes("/prefab/Spriter", (err, fab) => {
            if (err) {
                console.log(err);
                return;
            }
            newNode = cc.instantiate(fab);
            if (index == 1) {
                // console.log('index');
                this.loadRes(newNode)
            }
            rang = newNode.getChildByName('rang');
            moneyLabel = newNode.getChildByName('moneyLabel');
            name = newNode.getChildByName('name');
            rang.getComponent(cc.Label).string = mo.Ranking
            moneyLabel.getComponent(cc.Label).string = mo.Profit
            name.getComponent(cc.Label).string = mo.UserName
            this.RankingLists.content.addChild(newNode)
        });
    },

    getView() {
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            client: 1,
            clientVersion: '0.0.1'
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Common/getversion", _data, e => {
            let json = JSON.parse(e)
            console.log(json.object.circleUrl);
            console.log(this.ViewWeb);
            this.ViewWeb.url = json.object.circleUrl + '/?tok=' + Global.DataUsers.Token + '&usid=' + Global.DataUsers.UserId + '&type=' + 6
            // WebView.url = 'http://localhost:6667/?tok=' + Global.DataUsers.Token + '&usid=' + Global.DataUsers.UserId
            // this.ViewWeb.url = 'http://192.168.1.106:802/?tok=' + Global.DataUsers.Token + '&usid=' + Global.DataUsers.UserId + '&type=' + 6
            // console.log(this.ViewWeb.url)
            // console.log('--------------------------------------------------')
        })
    }

});
