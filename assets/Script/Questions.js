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
        prepareGame: cc.Label //等待与准备提示
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
        this.Getroom()
        this.nSocket()
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
            Userid: Global.DataUsers.sUserId,
            Token: Global.DataUsers.sToken,
            roomnumberid: Global.questions
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/exam/getroom", _data, e => {
            let mid = JSON.parse(e)
            if (mid.code == 12000) {
                console.log(mid)
                console.log(mid.object.CurrDateTime)
                console.log(mid.object.List);
                console.log(mid.object.Question.QuestionUrl);
                console.log(mid.object.Question.ExamRoomQuestionID);
                console.log(mid.object.Question.IsWrongAnswer);
                console.log(mid.object.IsMatch); //（0：参战，1：观战）
                console.log(mid.object.ExamRoomGameNumberID);

                this.RenNumber.string = mid.object.List.length
                this.ExamRoomGameNumberID = mid.object.ExamRoomGameNumberID
                if (mid.object.IsMatch == 0) {
                    this.DengdaiTitle.node.scale = 0
                    if (mid.object.Question.IsEndAnswer == 1) {
                        console.log('答wan啦');
                    }

                    if (mid.object.Status == 1) {
                        this.StartTime = mid.object.EndTimestamp - mid.object.CurrDateTime
                        this.StartTimeLabel.string = this.StartTime
                        this.GameTimeOuts(this.StartTimeLabel)
                        console.log('准备考试');
                        this.titles.string = '等待其Ta玩家'
                    }
                    if (mid.object.Status == 2) {
                        this.prepareGame.node.scale = 0
                        if (this.isCuo) {
                            this.btnd.interactable = true
                            this.btnc.interactable = true
                        } else {
                            console.log(this.isCuo);

                            this.scheduleOnce(() => {
                                this.btnd.interactable = true
                                this.btnc.interactable = true
                                this.errorWin.scale = 0;
                            }, 2);
                        }
                        // http://examimgftp.dsstyles.cn/UploadFile/Exam/20180510/14/3714dcef-0d73-45ef-8668-60a74404e4f8.png
                        // cc.loader.load('http://examimgftp.dsstyles.cn/UploadFile/Exam/20180510/14/3714dcef-0d73-45ef-8668-60a74404e4f8.png', function (err, tex) {
                        cc.loader.load(mid.object.Question.QuestionUrl, function (err, tex) {
                            _this.question.spriteFrame.setTexture(tex);
                            _this.question.node.scale = 1
                        });


                        this.CurrentQuestions = mid.object.Question.CurrentQuestions  //当前第几题


                        if (mid.object.Question.CurrentQuestions == mid.object.Question.QuestionsTotalsNumber ) {
                            //答完十题
                            alert('答完十题')
                            this.GetGameQuestions()
                        }

                        this.SetTimeA.scale = 0
                        this.StartTime = mid.object.EndTimestamp - mid.object.CurrDateTime
                        this.StartTimeView.string = this.StartTime
                        this.GameTimeOuts(this.StartTimeView)
                        console.log('开始考试');
                        var _this = this
                        this.ExamRoomQuestionID = mid.object.Question.ExamRoomQuestionID
                        this.Correct = mid.object.Question.Correct
                        this.Wrong = mid.object.Question.Wrong

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
    //倒计时
    GameTimeOuts(sb) {
        this.T2 = () => {
            if (this.StartTime < 1) {
                this.Getroom()
                this.unschedule(this.T2);
            } else {
                // this.unschedule(this.T2);
                let x = this.StartTime - 1;
                sb.string = x;
                if (this.StartTime < 5) {
                    sb.node.color = new cc.Color(255, 0, 0);
                    this.prepareGame.string = '开始答题'
                } else {
                    sb.node.color = new cc.Color(255, 255, 255);
                }
                this.StartTime = x;
            }
        };
        this.schedule(this.T2, 1);
    },


    //%51获取房间局数游戏记录
    GetGameQuestions() {
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.sUserId,
            Token: Global.DataUsers.sToken,
            ExamRoomGameNumberID: this.ExamRoomGameNumberID
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/exam/getexamroomgamerecords", _data, e => {
            let mid = JSON.parse(e)
            if (mid.code == 12000) {
                console.log(mid)
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
            Userid: Global.DataUsers.sUserId,
            Token: Global.DataUsers.sToken,
            roomnumberid: Global.questions,
            ExamRoomQuestionID: this.ExamRoomQuestionID,
            Answer: ass
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/exam/answer", _data, e => {
            let mid = JSON.parse(e)
            if (mid.code == 12000) {
                console.log(mid)
                this.Getroom()
                this.unschedule(this.T2);
                console.log(mid.object.IsWrongAnswer);
                if (mid.object.IsWrongAnswer == 1) {
                    this.btnd.interactable = false
                    this.btnc.interactable = false
                    console.log('答错啦');
                    this.isCuo = false
                    this.errorWin.scale = 1
                }
                if (mid.object.IsWrongAnswer == 0) {
                    this.isCuo = true
                }
            }
        })
    },
    // 音乐设置
    nSocket() {
        var ws = new WebSocket(Global.DataUsers.wsUrl);
        ws.onopen = (event) => {
            console.log("サーバー　オペ");
            if (ws.readyState === WebSocket.OPEN) {
                var room = {
                    Code: 102,
                    Data: {
                        roomId: Global.questions,
                        userId: Global.DataUsers.sUserId,
                        token: Global.DataUsers.sToken,
                    }
                };
                ws.send(JSON.stringify(room));
                console.log("WebSocket 卫星发射...！");
            } else {
                console.log("WebSocket 准备好卫星发射...！");
            }
        };
        ws.onmessage = (event) => {
            console.log("サーバーのメッセージ: " + event.data);
            let aData = JSON.parse(event.data).Data.Status
            let UserID = JSON.parse(event.data).Data.UserID
            // let Floor = JSON.parse(event.data).Data.Floor
            this.GetStatus(aData, UserID)
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

    GetStatus(x, u) { //sk里面的id
        switch (x) {
            case 0:
                console.log('进入房间')
                break;
            case 1:
                console.log('有人参战')
                break;
            case 2:
                console.log('有人观战')
                break;
            case 3:
                console.log('开始游戏')
                break;
            case 4:
                console.log('推出游戏')
                break;
            case 5:
                console.log('游戏结束')
                break;
            case 6:
                console.log('解散房间')
                break;
            case 7:
                console.log('人数不够')
                break;
            case 8:
                console.log('退出游戏')
                break;
            case 9:
                break;
            case 10:
                console.log('1')
                break;
            case 11:
                console.log('1')
                break;
            case 12:
                console.log('1')
                break;
            case 13:
                console.log('1')
                break;
            case 14:
                console.log('1')
                break;
            case 15:
                break;
            default:
                break;
        }
    },

    start() {

    },

    update(dt) {
        this._updataFillStart(this.horizontal, dt);
    },

    _updataFillStart: function (sprite, dt) {
        var fillStart = sprite.fillStart;
        fillStart = fillStart > 0 ? fillStart -= (dt * this.speed) : 1;
        sprite.fillStart = fillStart;
    },





});
