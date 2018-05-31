// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import { GetUserDatas, LoginTimeOut } from 'GetUserData';
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
        GoodesOneList: cc.ScrollView,
        GoodsWindow: cc.Node,
        GoodsTitle: cc.RichText,
        GoodsGold: cc.Label,
        GoodsImg: cc.Sprite,
        J1: cc.Button,
        J2: cc.Button,
        J3: cc.Label,
        SaveBtn: cc.Button,
        User_Name: cc.Label,
        User_Id: cc.Label,
        User_Gold: cc.Label,
        GoodsNumber: 0,
        GoodsGoldCoin: 0,
        GoodsName: ''
    },

    // LIFE-CYCLE CALLBACKS:
    // 账户数据设置
    SetInfo() {
        if (GetUserDatas()) {
            this.User_Name.string = Global.DataUsers.sNickName;
            this.User_Id.string = 'ID:' + Global.DataUsers.Login;
            this.User_Gold.string = Global.DataUsers.Balance
        } else {

        }
    },
    onLoad() {
        // 定义 SizeProvider，这里定义一个全局对象即可，不需要创建对象实例
        var screenSizeProvider = {
            getContentSize: function () {
                return cc.size(cc.visibleRect);
            },
            setContentSize: function (sizeOrX, y) {
                // 不做任何事情
            },

            _getWidth: function () {
                return this.getContentSize().width;
            },
            _getHeight: function () {
                return this.getContentSize().height;
            },
        };
        //设置用户数据
        this.SetInfo()
    },

    start() {
        this.ShopMsg()
    },
    ShopMsg() {
        this.GoodesOneList.content.removeAllChildren()
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/shopgoods/getgoodslist", _data, e => {
            let _e = JSON.parse(e)
            for (const iterator of _e.object) {
                var newNode
                cc.loader.loadRes("/prefab/GoodsSprite", (err, Prefab) => {
                    if (err) {
                        console.log(err)
                        return;
                    }
                    newNode = cc.instantiate(Prefab);

                    newNode.getChildByName('Title').getComponent(cc.Label).string = iterator.GoodsName
                    newNode.getChildByName('Money').getComponent(cc.Label).string = iterator.GoodsGoldCoin + '金币'
                    newNode.getChildByName('Number').getComponent(cc.Label).string = '剩余' + iterator.GoodsNumber + '件'

                    newNode.on(cc.Node.EventType.TOUCH_END, e => {
                        this.GoodsNumber = iterator.GoodsNumber
                        this.GoodsGoldCoin = iterator.GoodsGoldCoin
                        this.GoodsName = iterator.GoodsName
                        this.openWindowGoods(iterator.GoodsPic)/*图片，金币，件*/
                        this.GoodsWindow.scale = 1
                    })
                    
                    cc.loader.load({ url: iterator.GoodsPic, type: 'png' }, (err, tex) => {
                        if (err) {
                            console.log(err)
                            return;
                        }
                        console.log(newNode.getChildByName('Pic').getComponent(cc.Sprite).node.width)
                        console.log(newNode.getChildByName('Pic').getComponent(cc.Sprite).node.height)
                        
                        // console.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
                        newNode.getChildByName('Pic').getComponent(cc.Sprite).node.setContentSize(240,240)
                        newNode.getChildByName('Pic').getComponent(cc.Sprite).spriteFrame.setTexture(tex);
                    });
                    this.GoodesOneList.content.addChild(newNode);
                    // this.GoodesOneList.content.setContentSize(100,100)
                    // let _newNode = cc.find("sl/winText", newNode)
                    // _newNode.getComponentsInChildren(cc.Label)[0].string = gold;
                });
            }
        })
    }
    ,
    openWindowGoods(pic) {
        cc.loader.load({ url: pic, type: 'png' }, (err, tex) => {
            // console.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
            this.GoodsImg.spriteFrame.setTexture(tex);
        });
        this.GoodsTitle.string = "您确定支付<color=#FDC95A>" + this.GoodsGoldCoin + "金币</color>兑换" + this.GoodsName
        this.GoodsGold.string = "您当前余额为" + this.User_Gold.string + "金币 "
        if (this.User_Gold.string > this.GoodsGoldCoin) {
            this.SaveBtn.interactable = true
        }
    },
    closeWin() {
        this.GoodsWindow.scale = 0
    },
    J1Fn() {
        if (this.J3.string > 1) {
            this.J3.string--
            this.GoodsTitle.string = "您确定支付<color=#FDC95A>" + this.GoodsGoldCoin * this.J3.string + "金币</color>兑换" + this.GoodsName
        }
    },
    J2Fn() {
        this.J3.string++
        let n = this.GoodsGoldCoin * this.J3.string
        if (this.J3.string < this.GoodsNumber && n < this.User_Gold.string) {
            this.GoodsTitle.string = "您确定支付<color=#FDC95A>" + this.GoodsGoldCoin * this.J3.string + "金币</color>兑换" + this.GoodsName
        } else {
            this.J3.string--
        }
    },
    SaveBtnFn() {


    }
    // update (dt) {},
});
