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

        taskWindow: cc.Node,                   //   任务窗口

        taskListView: cc.ScrollView,           //   任务列表

        accomplishTaskWindow: cc.Node,         //   完成任务

        everydaySignIn: cc.Node,               //   每日签到

        accomplishEverydaySignIn: cc.Node,     //   签到成功

        accompBtn: cc.Button,                  //   签到按钮

        ruleWindow: cc.Node,                   //   游戏规则

        hintWindow: cc.Node,                   //   提示窗口

        getEggbtn: cc.Button,                  //   砸蛋按钮

        eggAnima: cc.Animation,                //   鸡蛋动画

        chuiziAnima: cc.Animation,             //   垂子动画

        GetEggPig: cc.Node,                      //获得饺子的窗口

        eggNumber: cc.Label,

        everyDay: {
            default: [],
            type: cc.Node
        },
        PigList: {
            default: [],
            type: cc.Node
        },
        //uid 名字 头像
        User_Name: cc.Label,
        User_Id: cc.Label,
        UserPic: cc.Sprite,

        Winners: cc.Node,                       //获奖名单
        PigText: 0, //记录蛋蛋

        ViewWeb: cc.WebView,

        Piggb: cc.AudioSource,
        PigClick: cc.AudioSource,
        PigShow: cc.AudioSource,
        isMis: true,
    },
    //用户数据
    SetInfo() {
        GetUserDatas()
        this.User_Name.string = Global.DataUsers.UserName;
        this.User_Id.string = 'ID:' + Global.DataUsers.Login;
        this.loaderUserIcon(Global.DataUsers.UserIcon, this.UserPic)
        this.GetLstUserCharacterInfo()
        this.getView()
    },
    loaderUserIcon(mo, nSprite) {
        cc.loader.load(mo, function (err, tex) {
            if (err) {
                console.log(err);
                return;
            }
            nSprite.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
        });
    },
    loadRes(newNode, picName) {
        cc.loader.loadRes("/Qus/" + picName, function (err, spriteFrame) {
            if (err) {
                console.log(err);
                return;
            }
            newNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spriteFrame);
        });
    },
    onLoad() {
        this.SetInfo()

        // let egg = cc.director.getScene().getChildByName('Canvas').getChildByName('egg').getComponent(cc.Animation)
        // let chuizi = cc.director.getScene().getChildByName('Canvas').getChildByName('chuizi').getComponent(cc.Animation)
        // egg.play()
        // chuizi.play()
        // console.log(egg);

    },
    MisClose() {
        if (this.isMis) {
            this.Piggb.stop()
            // this.PigClick.stop()
            // this.PigShow.stop()
            this.isMis = !this.isMis
        } else {
            this.isMis = !this.isMis
            this.Piggb.play()
        }
    },
    start() {

    },
    ruleWindowBtn(e, num) {
        this.ruleWindow.scale = num
        this.PigClick.play()
    },

    //获奖名单
    //鸡蛋动画
    //点击砸蛋
    //规则书名
    //音乐
    //返回
    // 每日任务
    openTask() {
        this.taskWindow.scale = 1
        this.GetLstCharacterCondition()
        this.PigClick.play()
    },
    closeTask() {
        this.taskWindow.scale = 0
        this.PigClick.play()
    },
    closeTaskWin() {
        this.PigClick.play()
        this.accomplishTaskWindow.scale = 0
        this.GetLstCharacterCondition()  //关闭再拉去数据
        this.GetLstUserCharacterInfo()
    },
    // 每日签到
    openEveryday() {
        this.GetSignIn()
        this.everydaySignIn.scale = 1
        this.PigClick.play()
    },
    closeEveryday() {
        this.everydaySignIn.scale = 0
        this.PigClick.play()
    },
    closeEverydayPir() {
        this.GetSignIn()
        this.accomplishEverydaySignIn.scale = 0
        this.PigClick.play()
    },
    // 分享

    //转盘
    GoPigDial() {
        cc.director.loadScene('PigDial')
    },
    //猪的卡片操作

    //获取任务列表
    GetLstCharacterCondition() {
        this.taskListView.content.removeAllChildren()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/LittlePigPeky/GetLstCharacterCondition", _data, e => {
            let _task = JSON.parse(e);

            // console.log(_task.object)

            for (const iterator of _task.object) {
                this.loadPre(iterator)
            }
        })
    },
    loadPre(iterator) {
        cc.loader.loadRes("/prefab/taskList", (err, Prefab) => {
            if (err) {
                console.log(err)
                return;
            }
            var newNode = cc.instantiate(Prefab)
            var taskPic = newNode.getChildByName('taskPic')
            var btn = newNode.getChildByName('btn')
            newNode.getChildByName('title').getComponent(cc.Label).string = iterator.Name
            newNode.getChildByName('text').getComponent(cc.Label).string = iterator.Introduction
            newNode.getChildByName('prize').getComponent(cc.Label).string = iterator.Reward
            newNode.getChildByName('prizeNum').getComponent(cc.Label).string = `${iterator.Total}/${iterator.Condition}`

            if (iterator.Status == 100) {
                // 2 前往
                // 100领取奖品
                // 0已领取
                this.loadRes(btn, 'lingqu')
                btn.on(cc.Node.EventType.TOUCH_END, () => {
                    this.ReceiveCondition(iterator.Type)
                })
            }
            if (iterator.Status == 2) {
                this.RuleCode(btn, iterator)
            }
            if (iterator.Status == 0) {
                this.loadRes(btn, 'yilingqu')
                btn.getComponent(cc.Button).interactable = false
            }
            this.loaderUserIcon(iterator.Icon, taskPic)
            this.taskListView.content.addChild(newNode)

        })


    },
    RuleCode(btn, iterator) {

        switch (iterator.RuleCode) {
            case 'rotarydraw':
                btn.on(cc.Node.EventType.TOUCH_END, () => {
                    // console.log('转盘抽奖');
                })
                break;
            case 'jisudatitransaction1':
                // console.log('极速答题');
                btn.on(cc.Node.EventType.TOUCH_END, () => {
                    cc.director.loadScene('QuestionsStart')
                })
                break;
            case 'jisudatitransaction0':
                // console.log('极速答题');
                btn.on(cc.Node.EventType.TOUCH_END, () => {
                    cc.director.loadScene('QuestionsStart')
                })
                break;
            case 'paileitransaction1':
                // console.log('排雷先锋');
                btn.on(cc.Node.EventType.TOUCH_END, () => {
                    cc.director.loadScene('GameStart')
                })
                break;
            case 'paileitransaction0':
                // console.log('排雷先锋');
                btn.on(cc.Node.EventType.TOUCH_END, () => {
                    cc.director.loadScene('GameStart')
                })
                break;
            case 'invitingFriends':
                // console.log("邀请好友并注册");
                break;
            case 'accumulativeRecharge':
                // console.log("累积充值");
                break;
            case 'recharge':
                // console.log('首次充值');
                break;
            case 'signIn':
                // console.log('每日签到');
                break;
            case 'register':
                // console.log('用户注册');
                break;

            default:
                break;
        }
    },
    //领取 任务
    ReceiveCondition(num) {
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            Type: num
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/LittlePigPeky/ReceiveCondition", _data, e => {
            this.accomplishTaskWindow.scale = 1;
            let _egg = JSON.parse(e);
        })
    },



    //获取签到信息
    GetSignIn() {
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/Sign/getsign", _data, e => {
            let _GetSignIn = JSON.parse(e);
            let _object = _GetSignIn.object
            // console.log(_GetSignIn)
            if (_GetSignIn.IsSign) {
                this.accompBtn.interactable = false
            }
            this.everyDay.forEach((iterator, index) => {
                // console.log(_object[index].Value)
                if (_object[index].IsSign == 1) {
                    iterator.getChildByName('getBox').scale = 1
                }
                iterator.getChildByName('everyDayLabel').getComponent(cc.Label).string = `砸蛋机会x${_object[index].Value}`
            });
        })
    },

    //签到
    SetSignIn() {
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/Sign/signin", _data, e => {
            let _SetSignIn = JSON.parse(e);
            if (_SetSignIn.code = 12000) {
                this.accomplishEverydaySignIn.scale = 1
            }
        })
    },
    //获取各个列表
    GetLstUserCharacterInfo() {
        this.Winners.removeAllChildren()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/LittlePigPeky/GetLstUserCharacterInfo", _data, e => {
            let _GetLst = JSON.parse(e);
            let _object = _GetLst.object
            let _UserRanking = _GetLst.UserRanking
            if (_GetLst.code = 12000) {
                this.eggNumber.string = _GetLst.UserOpportunity
                // this.PigList
                this.PigList.forEach((iterator, index) => {

                    if (_object[index].CharactersNumber < 1) {
                        iterator.getComponent(cc.Button).interactable = false
                    }
                    iterator.getChildByName('pigNum').getComponent(cc.Label).string = 'x' + _object[index].CharactersNumber;
                });

                for (const iterator of _UserRanking) {
                    this.PigShow.play()
                    var node = new cc.Node('Sprite');
                    var RichText = node.addComponent(cc.RichText);
                    RichText.string = '<color=#0fffff>恭喜 ' + iterator.UserDisplayName + ' 获得</color><color=#ffff00>' + iterator.Prize + '</c>'
                    RichText.fontSize = 24
                    RichText.lineHeight = 37
                    // console.log(this.Winners.getChildren().length);

                    if (this.Winners.getChildren().length > 2) {
                        break
                    } else {
                        this.Winners.addChild(node)

                    }
                }


            }
        })
    },
    radioButtonClicked: function (e, toggle) {
        // console.log(toggle);
        switch (toggle) {
            case 0:
                title += "1";
                break;
            case 1:
                title += "2";
                break;
            case 2:
                title += "3";
                break;
            default:
                break;
        }
    },


    //炸弹接口
    GetEgg() {
        if (this.eggNumber.string < 1) {
            this.hintWindow.scale = 1
            let win = this.hintWindow.getChildByName('windows')
            win.getChildByName('msg').getComponent(cc.Label).string = '还没有砸蛋机会哦~!做任务吧！'
            win.getChildByName('gotask').scaleX = 1
            win.getChildByName('kanseru').scaleX = 1
            win.getChildByName('queren').scaleX = 0
            return;
        }
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/LittlePigPeky/QuailEggs", _data, e => {
            let _egg = JSON.parse(e);
            this.eggNumber.string = this.eggNumber.string - 1
            this.getEggbtn.interactable = false
            // console.log(_egg.IsWinning)
            if (_egg.IsWinning == 0) {
                this.PigText = _egg.IsWinning
                this.chuiziAnima.play()
                this.chuiziAnima.on('finished', this.onFinished, this);

            }
            if (_egg.IsWinning == 1) {
                this.PigText = _egg.IsWinning
                this.chuiziAnima.play()
                this.chuiziAnima.on('finished', this.onFinished, this);
            }
        })
    },
    onFinished() {
        this.eggAnima.play()
        this.eggAnima.on('finished', this.openThisEgg, this);
    },
    openThisEgg() {
        this.scheduleOnce(function () {
            // 这里的 this 指向 component
            if (this.PigText == 0) {
                this.hintWindow.scale = 1
            }
            if (this.PigText == 1) {
                this.GetEggPig.scale = 1
            }
            this.getEggbtn.interactable = true
            this.eggAnima.stop()
        }, 0.2);

    },
    closeThisEgg() {
        this.hintWindow.scale = 0
    },
    //去任务
    GoTask() {
        this.hintWindow.scale = 0
        this.openTask()
    },
    GetEggPigFn() {
        this.GetEggPig.scale = 0
        this.GetLstUserCharacterInfo()
    },
    getView() {
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            client: 1,
            clientVersion: '0.0.1'
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Common/getversion", _data, e => {
            let json = JSON.parse(e)
            // console.log(json.object.circleUrl);
            // console.log(this.ViewWeb);
            // WebView.url = json.object.circleUrl + '/?tok=' + Global.DataUsers.Token + '&usid=' + Global.DataUsers.UserId
            // WebView.url = 'http://localhost:6667/?tok=' + Global.DataUsers.Token + '&usid=' + Global.DataUsers.UserId
            this.ViewWeb.url = 'http://192.168.1.106:802/?tok=' + Global.DataUsers.Token + '&usid=' + Global.DataUsers.UserId + '&type=' + 7
            console.log(this.ViewWeb.url)
            console.log('--------------------------------------------------')
        })
    }




















    // update (dt) {},
});
