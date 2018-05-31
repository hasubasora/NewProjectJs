// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import { LoginTimeOut, GetUserDatas } from "GetUserData";
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

        GetHallMsgUrl: '/caileigame/GetHallMsg',           //%.38获取大厅消息
        AddFollowUrl: '/caileigame/AddFollow',             //%.39大厅关注
        DelFollowUrl: '/caileigame/DelFollow',             //%.40大厅取消关注
        AddMyMsgUrl: '/caileigame/AddMyMsg',               //% 41大厅发送消息
        AddWithdrawalUrl: '/caileigame/AddWithdrawal',     //%.42金币转增
        scrollContent: cc.ScrollView,
        scrollContentRight: cc.ScrollView,
        GoldWindow: cc.Node,
        SaveId: cc.Label,
        SaveIdGive: '',
        GiveGold: cc.EditBox,
        hasGold: cc.Label,
        RichTextGold: cc.RichText,
        User_Name: cc.Label,
        User_Id: cc.Label,
        User_Gold: cc.Label,
        present: cc.Button,
        addMsgs: cc.EditBox,
        addMsgsBtn: cc.Button

    },

    // LIFE-CYCLE CALLBACKS:
    // 账户数据设置
    SetInfo() {
        if (GetUserDatas()) {
            this.User_Name.string = Global.DataUsers.sNickName;
            this.User_Id.string = 'ID:' + Global.DataUsers.Login;
            this.User_Gold.string = Global.DataUsers.Balance
            this.GetHallMsgFn()
        }
    },
    onLoad() {
        this.SetInfo()          //设置用户数据
        this.contentLeft = this.scrollContent.content
        this.contentRight = this.scrollContentRight.content

    },
    GetHallMsgFn() {
        let xhr = cc.loader.getXMLHttpRequest()
            , _data = {
                Userid: Global.DataUsers.UserId,
                Token: Global.DataUsers.Token,
            }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + this.GetHallMsgUrl, _data, e => {
            let hall = JSON.parse(e)
            if (hall.code == 12000) {
                this.contentLeft.removeAllChildren()
                let hallObj = hall.object
                //msgList大厅消息参数介绍
                let msgLists = hallObj.msgList
                for (const lists of msgLists) {
                    console.log(lists)
                    cc.loader.loadRes("/prefab/NodeMsg", (err, Prefab) => {
                        if (err) {
                            console.log(err)
                            return;
                        }
                        var newNode = cc.instantiate(Prefab);
                        // newNode.setPosition(this.node.width / 2, this.node.height / 2);
                        newNode.getChildByName('VIP').getComponentInChildren(cc.Label).string = 'ID:' + lists.UserName
                        newNode.getChildByName('liaotian').getComponentInChildren(cc.Label).string = lists.Msg

                        let btn1 = newNode.getChildByName('ImgSprite').getComponentsInChildren(cc.Button)

                        if (lists.Status != 1) {
                            btn1[1].node.scale = 0
                            btn1[0].interactable = false
                        } else {
                            if (lists.IsFollow) {//已关注
                                btn1[0].node.scale = 0
                            }
                            if (!lists.IsFollow) {
                                btn1[1].node.scale = 0
                            }
                            btn1[1].node.on(cc.Node.EventType.TOUCH_START, event => {
                                // console.log( newNode.getChildByName('ImgSprite').getComponentInChildren(cc.Button).normalSprite)
                                // console.log(new cc.SpriteFrame(cc.url.raw("resources/news/ysc.png")))
                                // console.log('已经关注！')
                                this.DelFollow(lists.UserId) //发送关注的id
                                btn1[0].node.scale = 1
                                btn1[1].node.scale = 0
                            })
                            btn1[0].node.on(cc.Node.EventType.TOUCH_START, event => {
                                // console.log('这是真的还没关注')
                                this.SaveUser(lists.UserId)
                                btn1[0].node.scale = 0
                                btn1[1].node.scale = 1
                            })

                        }
                        this.contentLeft.addChild(newNode);
                        console.log(newNode.getChildByName('ImgSprite').getComponentsInChildren(cc.Button))

                        // let _newNode = cc.find("sl/winText", newNode)
                        // _newNode.getComponentsInChildren(cc.Label)[0].string = gold;
                    });
                }

                //msgFollowList 关注用户列表参数介绍
                let msgFollowList = hallObj.msgFollowList
                for (const msg of msgFollowList) {
                    console.log(msg)
                    cc.loader.loadRes("/prefab/RightNode", (err, Prefab) => {
                        if (err) {
                            console.log(err)
                            return;
                        }
                        var newNode = cc.instantiate(Prefab);
                        // newNode.setPosition(this.node.width / 2, this.node.height / 2);
                        newNode.getChildByName('OSprite').getComponentInChildren(cc.Label).string = 'ID:' + msg.UserName

                        newNode.getChildByName('zhuanzhang').on(cc.Node.EventType.TOUCH_END, event => {
                            // 金币转正弹窗
                            this.GoldWindow.scale = 1
                            this.SaveIdGive = msg.UserName
                            this.SaveId.string = 'ID:' + msg.UserName
                            this.hasGold.string = '您当前的金币余额' + this.User_Gold.string + '金币'
                            this.RichTextGold.string = "您确定转赠<color=#FDC95A>" + this.GiveGold.string + "金币</color>给ID：" + msg.UserName + "吗？"
                        })
                        this.contentRight.addChild(newNode);

                        // let _newNode = cc.find("sl/winText", newNode)
                        // _newNode.getComponentsInChildren(cc.Label)[0].string = gold;
                    });
                }

            } else {
                LoginTimeOut(hall.code)
            }

        })
    },
    //关注用户
    SaveUser(oid) {
        let xhr = cc.loader.getXMLHttpRequest()
            , _data = {
                Userid: Global.DataUsers.UserId,
                Token: Global.DataUsers.Token,
                FollowUserID: oid
            }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + this.AddFollowUrl, _data, e => {
            let AddFollowObj = JSON.parse(e)
            this.GetHallMsgFn()
            // console.log(AddFollowObj)
        })
    },
    //关注用户
    DelFollow(oid) {
        let xhr = cc.loader.getXMLHttpRequest()
            , _data = {
                Userid: Global.DataUsers.UserId,
                Token: Global.DataUsers.Token,
                FollowUserID: oid
            }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + this.DelFollowUrl, _data, e => {
            let AddFollowObj = JSON.parse(e)
            this.GetHallMsgFn()
            // console.log(AddFollowObj)
        })
    },
    //转赠金币
    Withdrawal() {
        let xhr = cc.loader.getXMLHttpRequest()
            , _data = {
                Userid: Global.DataUsers.UserId,
                Token: Global.DataUsers.Token,
                AgentID: this.SaveIdGive, Money: this.GiveGold.string
            }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + this.AddWithdrawalUrl, _data, e => {
            let AddWithdrawal = JSON.parse(e)
            Global.alertWindw(AddWithdrawal.message)
            // console.log(AddWithdrawal)
        })
    },
    start() {

    },
    SaveGolds() {
        if (this.User_Gold.string < this.GiveGold.string) {
            this.present.interactable = false
            return;
        } else {
            this.present.interactable = false
        }
        if (this.GiveGold.string > 0) {
            this.present.interactable = true
        }
        this.RichTextGold.string = "您确定转赠<color=#FDC95A>" + this.GiveGold.string + "金币</color>给" + this.SaveId.string + "吗？"

    },
    closeBtn() {
        this.GoldWindow.scale = 0
    },
    AddMyMsgs() {
        let xhr = cc.loader.getXMLHttpRequest()
            , _data = {
                Userid: Global.DataUsers.UserId,
                Token: Global.DataUsers.Token,
                Msg: this.addMsgs.string
            }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + this.AddMyMsgUrl, _data, e => {
            let AddWithdrawal = JSON.parse(e)
            Global.alertWindw(AddWithdrawal.message)
            this.GetHallMsgFn()
            this.addMsgs.string=''
            this.addMsgsBtn.interactable = false
            // console.log(AddWithdrawal)
        })
    },
    changeAddMyMsg() {
        if (this.addMsgs.string) {
            this.addMsgsBtn.interactable = true
        } else {
            this.addMsgsBtn.interactable = false
        }
    }
    // update (dt) {},
});
