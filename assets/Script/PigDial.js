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
        ShowBoxWindow:cc.Node
    },
    SetInfo() {
        Global.getDataUsers()
        this.User_Glod.string = Global.DataUsers.sBalance;
        this.loadUserPointer()
        this.GetRoundaboutRecord()   //先加载一次 顺序就对了
    },
    onLoad() {
        this.SetInfo()

        // console.log(360 / 9);

        // console.log(this.pointer.node.rotation = this.pointer.node.rotation + 40);


        // this.scheduleOnce( ()=> {
        //     this.sssNumber = this.sssNumber+1
        //     console.log('我操？');

        // }, 5);


        // console.log(this.sssNumber);


    },

    loadUserPointer() {
        let _data = {
            Userid: Global.DataUsers.sUserId,
            Token: Global.DataUsers.sToken,
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
            this.radioButtonClicked(this.radioButton[0])
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
        this.PigList.forEach((iterator, index) => {
            if (_UserCharacter[index].CharactersNumber < 1) {
                iterator.getComponent(cc.Button).interactable = false
            }
            iterator.node.getChildByName('PigNum').getComponent(cc.Label).string = _UserCharacter[index].CharactersNumber;
        });
    },


    GetRoundaboutRecord() {
        this.LottleList.content.removeAllChildren()
        let _data = {
            Userid: Global.DataUsers.sUserId,
            Token: Global.DataUsers.sToken,
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
        // console.log(toggle);
        switch (index) {
            case 0:
                //5卡
                this.GetPointerUrl(index)
                break;
            case 1:
                //6卡
                this.GetPointerUrl(index)
                break;
            case 2:
                //7卡
                this.GetPointerUrl(index)
                break;
            case 3:
                //7卡
                this.GetPointerUrl(index)
                break;
            case 4:
                //7卡
                this.GetPointerUrl(index)
                break;
            default:
                break;
        }
    },
    GetPointerUrl(index) {
        this.pointerTitle.string = this._objectList[index].Conditions
        this.SaveNumber = this._objectList[index].RoundaboutType
        this.loaderUserIcon(this.Roundabout[index].Path, this.pointer)
        for (let i = 0; i < this.PigList.length; i++) {
            this.PigList[i].isChecked = false;
            if (i < this.SaveNumber) {
                //if 没有卡片的 就不选中
                if (this.PigList[i].node.getChildByName('PigNum').getComponent(cc.Label).string > 0) {
                    this.PigList[i].isChecked = true
                    this.PigList[i].interactable = true
                }
                // console.log(this.PigList[i].isChecked);
            } else {
                //自动干掉选择
                this.PigList[i].isChecked = false;
                this.PigList[i].interactable = false
            }
        }
        // console.log(this._objectList[index]);
        // console.log(this.Roundabout[index].Path);
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
    },
    PigCardLiseFn(e, num) {
        this.PigCardLise.scale = num
    },
    //选择小猪卡片
    selectPig(toggle) {
        var index = this.PigList.indexOf(toggle);
        let n = 0;
        this.PigList.forEach((ele, i) => {
            console.log(ele.isChecked);
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
                    ele.interactable = true
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
            Userid: Global.DataUsers.sUserId,
            Token: Global.DataUsers.sToken,
            VCode: str,
            Type: this.SaveNumber
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/LittlePigPeky/LuckDraw", _data, e => {
            let _pointer = JSON.parse(e);
            console.log(_pointer);
            if (_pointer.code == 12000) {
                console.log(_pointer.prize.no);
                console.log(_pointer.prize.prizeName);
                console.log(_pointer.prize.prizeNumber);
                console.log(_pointer.prize.prizeType);
                console.log(_pointer.prize.path);
                console.log(_pointer.prize.prompt);
                this.turntableStart(_pointer.prize.prizeType)
            }

        })
    },
    /**
     * 下面是转盘专用
     */

    //转盘旋转功能
    turntableFn() {
        this.PigArray = []
        this.PigList.forEach((ele, index) => {
            console.log(ele.isChecked);
            ele.isChecked ? this.PigArray.push(index + 1) : '';
        });
        console.log(this.PigArray.toString());
        if (this.PigArray.length < this.SaveNumber) {
            alert('抽奖卡片不够')
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

        // 1金币
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

        // 2人物
        // 3答题卡
        // 4再抽一次奖
        // 5谢谢参与
        // 6小猪佩奇砸金蛋机会
        let run = 10
        let sim = 2

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
        this.scheduleOnce( ()=> {
            this.ShowBoxWindow.scale = 1
            for (const radio of this.radioButton) {
                radio.interactable = true
            }
        }, 2);
       
        cc.loader.loadRes("/Qus/" + img, (err, spriteFrame) => {
            if (err) {
                console.log(err);
                return;
            }
            this.ShowBoxWindow.getChildByName('nSprite').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(spriteFrame)
        })
        console.log();
        
    },
    closeShowBoxWindow(){
        this.ShowBoxWindow.scale = 0
    }


})



