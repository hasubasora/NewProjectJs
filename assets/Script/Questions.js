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
        speed: 0.1,
        Gold: cc.Label,
        UserName: cc.Label,
        UserPic: cc.Node,
        UserID: cc.Label,
        titles: cc.Label,
        // 游戏进行中 请等待下一局开始
        // 答题开始
        // ['等待其他玩家', '开始倒计时', '答题倒计时'],
        // 等待其Ta玩家
        StartTime: 0,
        StartTimeLabel: cc.Label,
        StartTimeView: cc.Label,
        SetTimeA: cc.Node,
        horizontal: {
            default: null,
            type: cc.Sprite
        },
        question: {
            default: null,
            type: cc.Sprite
        },
        ExamRoomQuestionID: 0,
        Correct: 0,
        Wrong: 0,
        btnd: cc.Button,
        btnc: cc.Button,
        isCuo: true,
        DengdaiTitle: cc.Label,
        StartTitle: cc.Label,
        ExamRoomGameNumberID: 0,
        CurrentQuestions: 0,  //当前第几题
        errorWin: cc.Node,
        RenNumber: cc.Label,  //人数
        prepareGame: cc.Label, //等待与准备提示
        Annunciate: cc.Label,
        setAmount: cc.Label,
        allAmount: 0, //当前用户金额,
        ObjectList: '',
        RankingLists: cc.Node,
        ten: true,
        // 存储答题
        QusNumber: 0,
        QusNumbertitle: cc.Label,
        scrollViewLcc: cc.ScrollView,
        overRaing: cc.Node,
        moneyEnough: cc.Node, //充值
        myMonney: cc.Label,   //自己的收益
        RankingNumber: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.SetInfo()
        // this._updataFillStart(this.horizontal, dt);

        console.log('this.horizontal.fillStart');
        console.log(this.horizontal.fillStart);

    },
    SetInfo() {
        Global.getDataUsers()
        this.UserName.string = Global.DataUsers.sNickName;
        this.UserID.string = 'ID:' + Global.DataUsers.sLogin;
        this.Gold.string = Global.DataUsers.sBalance;
        this.loaderUserIcon(Global.DataUsers.sUserIcon, this.UserPic)
        this.Getroom()
        if (Global.DataUsers.wsUrl != 'undefined') {
            this.nSocket()
        }
    },

    // ゲーム　スタート
    // GameStart() {
    // cc.director.loadScene('Questions')
    //     this.GetInroom()
    // },
    //りんっぐ
    Getroom() {
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            roomnumberid: Global.questions
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/exam/getroom", _data, e => {
            let mid = JSON.parse(e)
            if (mid.code == 12000) {
                this.unschedule(this.T2);
                this.RankingList(mid)
                console.log(mid)
                // console.log(mid.object.CurrDateTime)
                // console.log(mid.object.List);
                // console.log(mid.object.Question.QuestionUrl);
                // console.log(mid.object.Question.ExamRoomQuestionID);
                // console.log(mid.object.Question.IsWrongAnswer);
                // console.log(mid.object.IsMatch); //（0：参战，1：观战）
                // console.log(mid.object.ExamRoomGameNumberID);
                this.Gold.string = mid.Balance
                if (this.QusNumber == mid.object.Question.QuestionsTotalsNumber) {
                    //答完十题
                    this.prepareGame.node.scale = 1
                    this.prepareGame.string = '答题完成！请等待其他玩家！'
                    this.question.node.scale = 0
                    this.ten = false
                } else {
                    console.log(mid.object.Question.CurrentQuestions);
                    console.log('__________________________');
                    this._updataFillStart(this.horizontal, this.QusNumber + 1);
                }
                this.RenNumber.string = mid.object.List.length
                this.ExamRoomGameNumberID = mid.object.ExamRoomGameNumberID
                //观战
                if (mid.object.IsMatch == 0) {
                    this.DengdaiTitle.node.scale = 0
                    if (mid.object.Question.IsEndAnswer == 1) {
                        console.log('答wan啦');
                    }
                    if (mid.object.Status == 1) {
                        this.prepareGame.node.scale = 1
                        this.StartTime = mid.object.EndTimestamp - mid.object.CurrDateTime
                        this.StartTimeLabel.string = this.StartTime
                        this.GameTimeOuts(this.StartTimeLabel)
                        console.log('准备考试');
                        this.titles.string = '等待其Ta玩家'
                        this.prepareGame.string = '正在等待各个玩家就位！'
                    }
                    if (mid.object.Status == 2) {
                        if (this.isCuo && this.ten) {
                            this.btnd.interactable = true
                            this.btnc.interactable = true
                        } else {
                            console.log(this.isCuo);
                        }
                        // http://examimgftp.hd4yx0.cn/UploadFile/Exam/20180510/14/3714dcef-0d73-45ef-8668-60a74404e4f8.png
                        // cc.loader.load('http://examimgftp.hd4yx0.cn/UploadFile/Exam/20180510/14/3714dcef-0d73-45ef-8668-60a74404e4f8.png', function (err, tex) {
                        if (this.ten) {
                            this.prepareGame.node.scale = 0
                            this.loadImg(mid.object.Question.QuestionUrl)
                        }
                        this.CurrentQuestions = mid.object.Question.CurrentQuestions  //当前第几题
                        this.QusNumbertitle.string = '第' + mid.object.Question.CurrentQuestions + '/' + mid.object.Question.QuestionsTotalsNumber + '题'
                        this.SetTimeA.scale = 0
                        this.StartTime = mid.object.EndTimestamp - mid.object.CurrDateTime
                        this.StartTimeView.string = this.StartTime
                        this.GameTimeOuts(this.StartTimeView)
                        this.ExamRoomQuestionID = mid.object.Question.ExamRoomQuestionID
                        this.Correct = mid.object.Question.Correct
                        this.Wrong = mid.object.Question.Wrong
                        console.log('开始考试');

                    }
                }
                if (mid.object.IsMatch == 1) {
                    console.log('观战---------------------------------------');
                    this.StartTime = mid.object.EndTimestamp - mid.object.CurrDateTime
                    this.StartTimeLabel.string = this.StartTime
                    this.GameTimeOuts(this.StartTimeLabel)
                    this.DengdaiTitle.node.scale = 1
                }
            }
        })
    },
    //下载图片
    loadImg(Url) {
        var _this = this
        cc.loader.load(Url, function (err, tex) {
            if (err) {
                console.log(err);
                return;
            }
            // _this.question.spriteFrame.setTexture(tex);
            var spriteFrame = new cc.SpriteFrame(tex);
            _this.question.spriteFrame = spriteFrame
            _this.question.node.scale = 1
        });
    },
    //倒计时
    GameTimeOuts(sb) {
        this.T2 = () => {
            if (this.StartTime < 1) {
                this.unschedule(this.T2);
                this.Getroom()
            } else {
                // this.unschedule(this.T2);

                let x = this.StartTime - 1;
                sb.string = x;
                if (this.StartTime < 5) {
                    if (this.ten) {
                        sb.node.color = new cc.Color(255, 0, 0);
                        this.prepareGame.string = '开始答题'
                    }
                } else {
                    sb.node.color = new cc.Color(255, 255, 255);
                
                }
                this.StartTime = x;
            }
        };
        this.schedule(this.T2, 1);
    },
    //游戏一局完成
    GetGameQuestions() {
        this.overRaing.scale = 1;
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            ExamRoomGameNumberID: this.ExamRoomGameNumberID
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/exam/getexamroomgamerecords", _data, e => {
            let mid = JSON.parse(e)
            if (mid.code == 12000) {
                console.log(mid)
                console.log(mid.object[0].Avatar)
                console.log(mid.object[0].AnswerTime)
                console.log(mid.object[0].Profit)
                console.log(mid.object[0].RecyclingAmount)
                console.log(mid.object[0].Ranking)
                console.log(mid.object[0].UserName)

                for (const iterator of mid.object) {
                    console.log(iterator.Ranking);
                    
                    switch (iterator.Ranking) {
                        case 1:
                            this.SetRaningPreFab(iterator, 'wone', iterator.UserID)
                            break;
                        case 2:
                            this.SetRaningPreFab(iterator, 'wTwo', iterator.UserID)
                            break;
                        case 3:
                            this.SetRaningPreFab(iterator, 'wThree', iterator.UserID)
                            break;
                        default:
                            this.SetRaningPreFab(iterator, 'wDef', iterator.UserID)
                            break;
                    }
                }

            }
        })
    },
    SetRaningPreFab(mo, fabs, uid) {
        var newNode, wSprite, wLabel, wMoney, wTime, numbers
        cc.loader.loadRes("/prefab/" + fabs, (err, fab) => {
            if (err) {
                console.log(err);
                return;
            }
            newNode = cc.instantiate(fab);
            console.log(newNode.getComponent(cc.Sprite));
            wSprite = newNode.getChildByName('nSprite');
            wLabel = newNode.getChildByName('wLabel');
            wMoney = newNode.getChildByName('wMoney');
            wTime = newNode.getChildByName('wTime');
            if (uid == Global.DataUsers.UserId) {
                this.RankingNumber.string = mo.Ranking
                this.myMonney.string = '+' + mo.RecyclingAmount
                this.loadRes(newNode)
            }
            if (newNode.getChildByName('number')) {
                numbers = newNode.getChildByName('number');
                numbers.getComponent(cc.Label).string = mo.Ranking
            }
            let nSprite_child = wSprite.getChildByName('nSprite_child')
            this.loaderUserIcon(mo.Avatar, nSprite_child)
            // console.log(RanSprite.getComponent(cc.Sprite));
            wLabel.getComponent(cc.Label).string = mo.UserName
            wMoney.getComponent(cc.Label).string = '+' + mo.RecyclingAmount
            wTime.getComponent(cc.Label).string = parseInt(mo.AnswerTime) + 's'
            this.scrollViewLcc.content.addChild(newNode)
        });


    },
    loadRes(newNode) {
        cc.loader.loadRes("/Qus/my", function (err, spriteFrame) {
            if (err) {
                console.log(err);
                return;
            }
            newNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spriteFrame);
        });
    },
    rmrematch() { //再来一局
        this.overRaing.scale = 0;
        this.scrollViewLcc.content.removeAllChildren() //默认true
        this.GameStart()
    },
    // ゲーム　スタート
    GameStart() {
        if (this.Gold.string < 100) {
            this.moneyEnough.scale = 1
            return
        }
        this.GetInroom()
    },

    //りんっぐ
    GetInroom() {
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            ExamRoomID: 0
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/exam/inroom", _data, e => {
            let mid = JSON.parse(e)
            if (mid.code == 12000) {
                Global.questions = mid.Data
                console.log(Global.questions)
                this.Getroom()
                //初始化数据
                this.QusNumber = 0
                this.question.node.scale = 0
                this.prepareGame.node.scale = 1
                this.prepareGame.string = '正在等待各个玩家就位！'
                this.SetTimeA.scale = 1
                this.btnd.interactable = false
                this.btnc.interactable = false
                this.ten = true
                this.isCuo = true
                this.nSocket()
            }
        })
    },
    //正确的
    Corrects() {
        this.SaveCorrects(this.Correct)
    },
    //错误的
    Wrongs() {
        this.SaveCorrects(this.Wrong)
    },
    //发送答案exam/answer
    SaveCorrects(ass) {
        this.btnd.interactable = false
        this.btnc.interactable = false
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            roomnumberid: Global.questions,
            ExamRoomQuestionID: this.ExamRoomQuestionID,
            Answer: ass
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/exam/answer", _data, e => {
            let mid = JSON.parse(e)
            if (mid.code == 12000) {
                console.log(mid)

                if (mid.object.IsWrongAnswer == 1) {
                    this.btnd.interactable = false
                    this.btnc.interactable = false
                    console.log('答错啦');
                    this.isCuo = false
                    this.errorWin.scale = 1
                    this.scheduleOnce(() => {
                        this.btnd.interactable = true
                        this.btnc.interactable = true
                        this.errorWin.scale = 0;
                    }, 2);
                }
                if (mid.object.IsWrongAnswer == 0) {
                    this.unschedule(this.T2);
                    this.isCuo = true
                    this.Getroom()
                    this.QusNumber = this.QusNumber + 1
                    console.log('答对:' + this.QusNumber);

                }
            }
        })
    },
    //计算收益和排行榜
    RankingList(mid) {
        if (mid.object.List.length <= 1) {
            return
        }
        let flag = true
        let n = mid.object.List.length
        let objects = mid.object.List
        while (flag) {
            flag = false;
            for (let i = 1; i < n; i++) {
                if (objects[i - 1].Ranking > objects[i].Ranking) {
                    var temp = objects[i - 1];
                    objects[i - 1] = objects[i];
                    objects[i] = temp;
                    this.ObjectList = JSON.parse(JSON.stringify(objects))
                    flag = true;
                } else {
                    //没有重新排序
                    this.ObjectList = JSON.parse(JSON.stringify(objects))
                }
            }
            n--;
        }
        for (let s = this.ObjectList.length; s > 0; s--) {
            var mo = this.ObjectList[s - 1]
            if (s < this.ObjectList.length) {
                let moe = this.ObjectList[s]
                let mo2 = moe.Amount / s
                let mo1 = this.allAmount / s
                let offsetAmount = mo2 + mo1
                mo.innerList = offsetAmount.toFixed(2)
            } else {
                //当前是收益
                let setAmount = mo.Amount / s
                this.allAmount = setAmount  //保存在全部
                mo.innerList = setAmount.toFixed(2)
            }
        }
        this.RankingLists.removeAllChildren();
        for (const iterator of this.ObjectList) {
            if (Global.DataUsers.UserId == iterator.UserID) {
                this.setAmount.string = iterator.innerList
            }
            this.loaderFab(iterator)
        }
    },
    loaderFab(mo) {
        var newNode, RanSprite, RanLabel, RanBoxLabex
        cc.loader.loadRes("/prefab/bbx", (err, fab) => {
            if (err) {
                console.log(err);
                return;
            }
            newNode = cc.instantiate(fab);
            RanLabel = cc.find("RanIcon/RanLabel", newNode);
            RanSprite = newNode.getChildByName('RanSprite').getChildByName('nSprite');
            RanBoxLabex = cc.find("RanBox/RanBoxLabex", newNode);
            // console.log(RanSprite.getComponent(cc.Sprite));
            this.loaderUserIcon(mo.Avatar, RanSprite)
            RanLabel.getComponent(cc.Label).string = mo.Ranking
            RanBoxLabex.getComponent(cc.Label).string = mo.innerList
            this.RankingLists.addChild(newNode)
        });
    },

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
    nSocket(ns) {
        console.log(ns);
        
        var ws = new WebSocket(Global.DataUsers.wsUrl);
        if (ns==1) {
            ws.close()
        }
        ws.onopen = (event) => {
            console.log("サーバー　オペ");
            if (ws.readyState === WebSocket.OPEN) {
                var room = {
                    Code: 102,
                    Data: {
                        roomId: Global.questions,
                        userId: Global.DataUsers.UserId,
                        token: Global.DataUsers.Token,
                    }
                };
                ws.send(JSON.stringify(room));
                console.log("WebSocket 卫星发射...！");
            } else {
                console.log("WebSocket 准备好卫星发射...！");
            }
        };
        ws.onmessage = (event) => {
            let evMsg = JSON.parse(event.data)
            if (evMsg.Code == 103) {
                Global.socketMsg = '恭喜玩家' + evMsg.Data.UserDisplayName + '获得' + evMsg.Data.Profit + '金币'
            } else {
                console.log("サーバーのメッセージ: " + event.data);

            }

            let aData = JSON.parse(event.data).Data.Status
            let UserID = JSON.parse(event.data).Data.UserID
            // let Floor = JSON.parse(event.data).Data.Floor
            this.GetStatus(aData, UserID, ws)
        };
        ws.onerror = (event) => {
            console.log("メッセージ エッロ！！");
            // this.schedule(function () {
            //   // 这里的 this 指向 component
            //   this.doSomething();
            // }, 1, 99, 0);
        };
        ws.onclose = (event) => {
            console.log("サーバー　オフ.");
        };

    },

    GetStatus(x, u, ws) { //sk里面的id
        switch (x) {
            case 0:
                console.log('进入房间')
                break;
            case 1:
                console.log('有人参战')
                this.Getroom()
                break;
            case 2:
                console.log('有人观战')
                this.Getroom()
                break;
            case 3:
                console.log('开始游戏')
                this.Getroom()
                break;
            case 4:
                console.log('推出游戏')
                break;
            case 5:
                console.log('游戏结束')
                this.GetGameQuestions()
                break;
            case 6:
                ws.close()
                console.log('解散房间')
                break;
            case 7:
                console.log('人数不够')
                break;
            case 8:
                console.log('退出游戏')
                break;
            default:
                break;
        }
    },

    start() {

    },
    goHome() {
        this.nSocket(1)
        cc.director.loadScene('QuestionsStart');
    },
    update(dt) {

        this.Annunciate.string = Global.socketMsg
    },

    _updataFillStart: function (sprite, dt) {
        var fillStart = sprite.fillStart;
        // fillStart = fillStart > 0 ? fillStart -= (dt * this.speed) : 1;
        console.log((dt * this.speed));
        sprite.fillStart = (dt * this.speed);
    },





});
