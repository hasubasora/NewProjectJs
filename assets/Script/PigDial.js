import { GetUserDatas } from 'GetUserData'
cc.Class({
    extends: cc.Component,
    properties: {
        pointer: {
            default: null,
            type: cc.Sprite
        },
        pointerButton: {
            default: null,
            type: cc.Node
        },
        pointerTitle: {
            default: null,
            type: cc.Label
        },
        SaveNumber: 0,           //存盘id
        pointerText: {
            default: null,
            type: cc.Label
        },
        speed: 20,
        sssNumber: 0, //目标数字
        Winners: cc.Node, //获奖名单
        TheWinningRecord: cc.Node, //获奖记录
        TheWinningRecordWindow: cc.Node, //获奖记录窗口
        PigCardLise: cc.Node,
        PigList: {
            default: [],
            type: cc.Toggle
        },
        radioButton: {
            default: [],
            type: cc.Toggle
        },
        Roundabout: {
            get: function () {
                return this._Roundabout;
            },
            set: function (value) {
                this._Roundabout = value;
            }
        },
        _objectList: {
            get: function () {
                return this._objectLists;
            },
            set: function (value) {
                this._objectLists = value;
            }
        },
        User_Glod: cc.Label,
        PigArray: [],
        LottleList: cc.ScrollView,
        runtime: 0,  //已经被旋转的角度
        ShowBoxWindow: cc.Node,
        run: 10,
        sim: 5,
        startBtn: cc.Button,
        winNode: cc.Node,
        ruleWinNodes: cc.Node,
        Piggb: cc.AudioSource,
        PigClick: cc.AudioSource,
        PigShow: cc.AudioSource,
        isMis: true,
        ViewWeb: cc.WebView,
        PigArrayNumber: []
    },
    SetInfo() {
        GetUserDatas()
        this.User_Glod.string = Global.DataUsers.Balance;
        this.loadUserPointer()
        this.GetRoundaboutRecord()   //先加载一次 顺序就对了
        this.getView()

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
    onLoad() {
        this.SetInfo()
        this.PigBox = []
        this.PigNumbers = 0
        // console.log(360 / 9);
        this.RoundsNumber = 0
        // console.log(this.pointer.node.rotation = this.pointer.node.rotation + 40);


        // this.scheduleOnce( ()=> {
        //     this.sssNumber = this.sssNumber+1
        //     console.log('我操？');

        // }, 5);


        // console.log(this.sssNumber);

        this.sRound = true
    },

    loadUserPointer() {
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/LittlePigPeky/GetRoundabout", _data, e => {
            let _UserPointer = JSON.parse(e);
            console.log(_UserPointer);
            // UserRanking 排行榜
            let _UserRanking = _UserPointer.UserRanking
            //UserCharacter 用户有什么人物
            let _UserCharacter = _UserPointer.UserCharacter
            if (_UserPointer.code = 12000) {
                // this.eggNumber.string = _UserPointer.UserOpportunity
                this.PigListType(_UserCharacter)
                // this.PigList
                this.RankingMsg(_UserRanking)
            }
            //RoundaboutInfo 转盘信息

            let _Roundabout = _UserPointer.Roundabout
            this.Roundabout = _Roundabout

            let _object = _UserPointer.object
            this._objectList = _object
            this.radioButtonClicked(this.radioButton[this.RoundsNumber])
        })
    },
    //抽到的东西
    RankingMsg(_UserRanking) {
        for (const iterator of _UserRanking) {
            var node = new cc.Node('Sprite');
            var RichText = node.addComponent(cc.RichText);
            RichText.string = '<color=#0fffff>恭喜 ' + iterator.UserDisplayName + ' 获得</color><color=#ffff00>' + iterator.Prize + '</c>'
            RichText.fontSize = 24
            RichText.lineHeight = 37
            if (this.Winners.getChildren().length > 2) {
                break
            } else {
                this.Winners.addChild(node)
            }
        }
    },
    //猪
    PigListType(_UserCharacter) {
        this.PigArrayNumber = []
        this.PigList.forEach((iterator, index) => {
            if (_UserCharacter[index].CharactersNumber < 1) {
                iterator.getComponent(cc.Button).interactable = false
            }
            iterator.node.getChildByName('PigNum').getComponent(cc.Label).string = _UserCharacter[index].CharactersNumber;
            this.PigArrayNumber.push(_UserCharacter[index].CharactersNumber)

        });


    },
    bubbleSort(arr) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) { //相邻元素两两对比
                    var temp = arr[j + 1]; //元素交换
                    arr[j + 1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    },
    GetRoundaboutRecord() {
        this.LottleList.content.removeAllChildren()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            PageIndex: 1,
            PageSize: 10
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/LittlePigPeky/GetRoundaboutRecord", _data, e => {
            let _GetRound = JSON.parse(e);
            console.log(_GetRound);
            if (_GetRound.code == 12000) {
                this._GetRounds(_GetRound)
            }
        })
    },
    _GetRounds(_GetRound) {
        for (const iterator of _GetRound.list) {
            cc.loader.loadRes("/prefab/Lottery", (err, Prefab) => {
                if (err) {
                    console.log(err)
                    return;
                }
                let newNode = cc.instantiate(Prefab)
                let taskPic = newNode.getChildByName('taskPic').getComponent(cc.Sprite)
                let btn = newNode.getChildByName('btn')
                this.loaderUserIcon(iterator.Path, taskPic)
                newNode.getChildByName('text').getComponent(cc.Label).string = iterator.RoundaboutTypeName
                newNode.getChildByName('text2').getComponent(cc.Label).string = iterator.DetailedTypeName
                newNode.getChildByName('prizeNum').getChildByName('time').getComponent(cc.Label).string = iterator.Time
                this.LottleList.content.addChild(newNode)
            })
        }
    },
    //下面的切换列表
    radioButtonClicked: function (toggle) {
        var index = this.radioButton.indexOf(toggle);
        switch (index) {
            case 0:
                //5卡
                this.GetPointerUrl(index)
                this.RoundsNumber = 0
                break;
            case 1:
                //6卡
                this.GetPointerUrl(index)
                this.RoundsNumber = 1
                break;
            case 2:
                //7卡
                this.GetPointerUrl(index)
                this.RoundsNumber = 2
                break;
            case 3:
                //8卡
                this.GetPointerUrl(index)
                this.RoundsNumber = 3
                break;
            case 4:
                //9卡
                this.GetPointerUrl(index)
                this.RoundsNumber = 4
                break;
            default:
                break;
        }
    },
    GetPointerUrl(index) {

        // this.pointerTitle.string = this._objectList[index].Conditions
        this.SaveNumber = this._objectList[index].RoundaboutType
        //
        this.loaderUserIcon(this.Roundabout[index].Path, this.pointer)
        var numbers = 0
        for (let i = 0; i < this.PigList.length; i++) {
            this.PigList[i].isChecked = false;
            if (this.PigList[i].node.getChildByName('PigNum').getComponent(cc.Label).string > 0) {
                // if (i < this.SaveNumber) {
                //if 没有卡片的 就不选中
                this.PigList[i].isChecked = true
                this.PigList[i].interactable = true
                // console.log(this.PigList[i].isChecked);
                // } 
                if (this.PigList[i].isChecked) {
                    numbers++
                }
                if (numbers > this.SaveNumber) {
                    this.PigList[i].isChecked = false;
                    this.PigList[i].interactable = false
                }
            } else {
                //自动干掉选择
                this.PigList[i].isChecked = false;
                this.PigList[i].interactable = false
            }

        }
        // console.log(this._objectList[index]);
        // console.log(this.Roundabout[index].Path);
        this.ForPigBox()
    },
    ForPigBox() {
        this.PigBox = []
        this.PigNumbers = 0
        // console.log(this.bubbleSort(this.PigArrayNumber));
        let PigArrays = this.bubbleSort(this.PigArrayNumber)
        for (const iterator of PigArrays) {
            if (iterator > 0) {
                this.PigBox.push(iterator)
            }
        }
        this.NumberBox = this.PigBox;
        this.ForPigBoxTwo()
    },
    ForPigBoxTwo() {
        let tt = []
        if (this.NumberBox.length >= this.SaveNumber) {
            for (const PigBoxItem of this.NumberBox) {
                if (PigBoxItem > 0) {
                    tt.push(PigBoxItem - 1)
                }
            }
            if (tt.length >= this.SaveNumber) {
                this.PigNumbers++
            } else {
                // console.log('不够了');
            }
            this.NumberBox = tt
            this.ForPigBoxTwo()
        } else {
            // console.log('长度不够');
        }
        // console.log(this.PigNumbers + '次数');
        this.pointerTitle.string = this.PigNumbers
    },
    loaderUserIcon(mo, nSprite) {
        cc.loader.load(mo, function (err, tex) {
            if (err) {
                console.log(err);
                return;
            }
            nSprite.spriteFrame = new cc.SpriteFrame(tex);
        });
    },
    //炸弹
    GoPigDial() {
        cc.director.loadScene('PigHome')
    },
    TheWinningRecordFn(e, num) {
        this.TheWinningRecordWindow.scale = num
        if (num == 1) {
            this.GetRoundaboutRecord()
        }
        this.PigClick.play()
    },
    PigCardLiseFn(e, num) {
        this.PigCardLise.scale = num
        this.PigClick.play()
    },
    //选择小猪卡片
    selectPig(toggle) {
        var index = this.PigList.indexOf(toggle);
        let n = 0;
        this.PigList.forEach((ele, i) => {
            if (ele.isChecked) {
                n++
            }
        });
        if (n == this.SaveNumber) {
            console.log('有' + this.SaveNumber + '个');
            this.PigList.forEach((ele, i) => {
                if (!ele.isChecked) {
                    ele.interactable = false
                }
            });
        } else {
            this.PigList.forEach((ele, i) => {
                if (!ele.isChecked) {
                    if (this.PigList[i].node.getChildByName('PigNum').getComponent(cc.Label).string > 0) {
                        ele.interactable = true
                    }
                }
            });
        }
    },
    //抽奖发送
    loadMsgPointer(str) {
        for (const radio of this.radioButton) {
            radio.interactable = false
        }

        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            VCode: str,
            Type: this.SaveNumber
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/LittlePigPeky/LuckDraw", _data, e => {
            let _pointer = JSON.parse(e);
            console.log(_pointer);
            if (_pointer.code == 12000) {
                this.pointerTitle.string = this.pointerTitle.string - 1
                console.log(_pointer.prize.path);
                console.log(_pointer.prize.prompt);
                this.turntableStart(_pointer.prize.prizeType)
                //拉去猪列表
            }

        })
    },
    /**
     * 下面是转盘专用
     */

    //转盘旋转功能
    turntableFn() {
        this.startBtn.interactable = false;
        this.PigArray = []
        this.PigList.forEach((ele, index) => {
            // console.log(ele.isChecked);
            ele.isChecked ? this.PigArray.push(index + 1) : '';
        });
        console.log(this.PigArray.toString());
        if (this.PigArray.length < this.SaveNumber) {
            this.closeWinNode(1)
            this.startBtn.interactable = true
            return
        }
        this.loadMsgPointer(this.PigArray.toString())

    },
    //转盘停止功能
    turntableStop() { },
    //转盘初始化数据
    turntableStart(numberSave) {
        // 创建一个移动动作
        // var rotateTo = cc.rotateTo(持续时间, 旋转角度X，旋转角度Y);
        // var actionBy = cc.rotateBy(持续时间, 旋转角度X，旋转角度Y);
        // var actionBy = cc.rotateBy(2, 360 * 5).easing(cc.easeCubicActionOut());

        // 旋转的剩下80 280+40 是娃娃 

        // 移动40 金币x10

        // 移动80 答题卡

        // 移动120 炸弹

        // 移动160 再来一次

        // 移动 200 扫雷卡

        // 移动240 话费30

        // 移动280 谢谢

        // 移动320 娃娃一套

        // 移动 360 京东卡


        let a1 = parseInt(Math.random() * 35 + 25)
        // let a2 = parseInt(Math.random() * 35 + 105)
        let a3 = parseInt(Math.random() * 35 + 64)
        let a4 = parseInt(Math.random() * 35 + 145)
        let a5 = parseInt(Math.random() * 35 + 260)
        let a6 = parseInt(Math.random() * 35 + 105)
        // console.log('----------上次的角度------------');
        // console.log(this.runtime);
        // console.log('----------这次的角度------------');
        // console.log(this.runtime + a3);
        // 1金币
        // 2人物
        // 3答题卡
        // 4再抽一次奖
        // 5谢谢参与
        // 6小猪佩奇砸金蛋机会
        let sim = this.sim
        let run = this.run
        switch (numberSave) {
            case 1:
                var actionBy = cc.rotateBy(sim, 360 * run + (this.runtime + a1)).easing(cc.easeCubicActionOut());
                this.runtime = 360 - a1
                // 执行动作
                this.pointer.node.runAction(actionBy);
                this.ShowBox(numberSave, 'bit')
                //显示获奖信息
                break;
            case 2:
                // var actionBy = cc.rotateBy(sim, 360 * run + 40).easing(cc.easeCubicActionOut());
                // // 执行动作
                // this.pointer.node.runAction(actionBy);

                break;
            case 3:
                var actionBy = cc.rotateBy(sim, 360 * run + (this.runtime + a3)).easing(cc.easeCubicActionOut());
                // 执行动作
                this.runtime = 360 - a3
                this.pointer.node.runAction(actionBy);
                this.ShowBox(numberSave, 'datika')
                break;
            case 4:
                var actionBy = cc.rotateBy(sim, 360 * run + (this.runtime + a4)).easing(cc.easeCubicActionOut());
                // 执行动作
                this.runtime = 360 - a4
                this.pointer.node.runAction(actionBy);
                this.ShowBox(numberSave, 'next')
                break;
            case 5:
                var actionBy = cc.rotateBy(sim, 360 * run + (this.runtime + a5)).easing(cc.easeCubicActionOut());
                // 执行动作
                this.runtime = 360 - a5
                this.pointer.node.runAction(actionBy);
                this.ShowBox(numberSave, 'xiexie')

                break;
            case 6:
                var actionBy = cc.rotateBy(sim, 360 * run + (this.runtime + a6)).easing(cc.easeCubicActionOut());
                // 执行动作
                this.runtime = 360 - a6
                this.pointer.node.runAction(actionBy);
                this.ShowBox(numberSave, 'zhadan')
                break;
            default:
                break;
        }


        // 停止一个动作
        // node.stopAction(action);
        // 停止所有动作
        // node.stopAllActions();
    },
    ShowBox(num, img) {
        if (num == 1 || num == 2 || num == 4 || num == 5) {
            this.ShowBoxWindow.getChildByName('queding').setPosition(cc.v2(0, -216))
            this.ShowBoxWindow.getChildByName('liji').scale = 0
        }
        if (num == 3 || num == 6) {
            this.ShowBoxWindow.getChildByName('queding').setPosition(cc.v2(-146, -216))
            this.ShowBoxWindow.getChildByName('liji').scale = 1
            if (num == 3) {
                this.ShowBoxWindow.getChildByName('liji').on(cc.Node.EventType.TOUCH_END, () => {
                    cc.director.loadScene('QuestionsStart')
                })
            }
            if (num == 6) {
                this.ShowBoxWindow.getChildByName('liji').on(cc.Node.EventType.TOUCH_END, () => {
                    cc.director.loadScene('PigHome')
                })
            }
        }
        this.scheduleOnce(() => {
            this.ShowBoxWindow.scale = 1
            this.startBtn.interactable = true
            for (const radio of this.radioButton) {
                radio.interactable = true
            }
        }, this.sim);

        cc.loader.loadRes("/Qus/" + img, (err, spriteFrame) => {
            if (err) {
                console.log(err);
                return;
            }
            this.ShowBoxWindow.getChildByName('nSprite').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spriteFrame)
        })
    },
    closeShowBoxWindow() {
        this.ShowBoxWindow.scale = 0
        this.loadUserPointer()
        this.PigClick.play()
    },
    closeWinNode(num) {
        this.winNode.scale = num
        this.PigClick.play()
    },
    ruleWinNode(e, num) {
        this.ruleWinNodes.scale = num
        this.PigClick.play()
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
            this.ViewWeb.url = json.object.circleUrl + '/?tok=' + Global.DataUsers.Token + '&usid=' + Global.DataUsers.UserId + '&type=' + 7
            // this.ViewWeb.url = 'http://192.168.1.106:802/?tok=' + Global.DataUsers.Token + '&usid=' + Global.DataUsers.UserId + '&type=' + 7
            console.log(this.ViewWeb.url)
            console.log('--------------------------------------------------')
        })
    }
})




