
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
        GoodsTitle2: cc.Label,
        GoodsGold: cc.Label,
        GoodsGold2: cc.Label,
        GoodsImg: cc.Sprite,
        J1: cc.Button,
        J2: cc.Button,
        J3: cc.Label,
        SaveBtn: cc.Button,
        User_Name: cc.Label,
        User_Pic: cc.Sprite,
        User_Id: cc.Label,
        User_Gold: cc.Label,
        GoodsNumber: 0,
        GoodsGoldCoin: 0,
        GoodsName: '',
        GoodsID: '',
        ScrollViews: cc.ScrollView,
        ShowRorderBox: cc.Node,
        tishi: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    // 账户数据设置
    SetInfo() {
        this.User_Name.string = Global.DataUsers.UserName
        this.User_Id.string = 'ID:' + Global.DataUsers.Login
        this.User_Gold.string = Global.DataUsers.Balance
        Global.loaderUserIcon(Global.DataUsers.UserIcon, this.User_Pic)
        this.getuserorderlist()
        Global.GetMessges(obj => {
            if (obj) {
                Global.addressId = obj[0].ID
            }
        })
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
                        this.GoodsID = iterator.GoodsID
                        this.openWindowGoods(iterator.GoodsPic, iterator.GoodsMarketPrice)/*图片，金币，件*/
                        this.GoodsWindow.scale = 1
                        this.J3.string = 1
                    })
                    Global.loaderUserIcon(iterator.GoodsPic, newNode.getChildByName('Pic').getComponent(cc.Sprite))
                    this.GoodesOneList.content.addChild(newNode);
                    // this.GoodesOneList.content.setContentSize(100,100)
                    // let _newNode = cc.find("sl/winText", newNode)
                    // _newNode.getComponentsInChildren(cc.Label)[0].string = gold;
                });
            }
        })
    }
    ,
    openWindowGoods(pic, gmp) {
        cc.loader.load({ url: pic, type: 'png' }, (err, tex) => {
            // console.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
            this.GoodsImg.spriteFrame.setTexture(tex);
        });
        this.GoodsTitle.string = "您确定支付<color=#FDC95A>" + this.GoodsGoldCoin + "金币</color>兑换" + this.GoodsName
        this.GoodsGold.string = "您当前余额为" + this.User_Gold.string + "金币 "
        this.GoodsGold2.string = '￥' + gmp
        this.GoodsTitle2.string = this.GoodsName
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
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            GoodsId: this.GoodsID,
            Number: this.J3.string,
            AddressId: Global.addressId
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/shoporder/goodsexchange", _data, e => {
            let _e = JSON.parse(e)
            if (_e.code == 12000) {
                this.User_Gold.string = this.User_Gold.string - this.GoodsGoldCoin
                this.GoodsWindow.scale = 0
                this.tishi.scale = 1
                this.tishi.getComponentsInChildren(cc.Label)[0].string = '兑换成功'

                console.log('兑换成功');
            }

        })
    },
    getuserorderlist() {
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/shoporder/getuserorderlist", _data, e => {
            let _e = JSON.parse(e)
            if (_e.code == 12000) {
                for (const iterator of _e.object) {
                    Global.loadPre('record', record => {
                        let Labels = record.getChildByName('sNode').getComponentsInChildren(cc.Label)
                        let Sp = record.getChildByName('sNode').getComponentsInChildren(cc.Sprite)
                        Labels[0].string = iterator.GoodsName
                        if (iterator.ShippingNo) {
                            Labels[1].string = `快递单号:${iterator.ShippingNo}(${iterator.ExpressName})`
                        }
                        Labels[2].string = iterator.GoodsNumber
                        Labels[3].string = iterator.GoodsGoldCoin
                        Labels[4].string = iterator.StrCreateTime
                        Global.loaderUserIcon(iterator.GoodsPic, Sp[1])
                        this.ScrollViews.content.addChild(record)
                    })
                }

            }
        })
    },
    ShowRorder(e, n) {
        this.ShowRorderBox.scale = n
        if (n == 1) {
            this.ScrollViews.content.removeAllChildren()
            this.getuserorderlist()
        }
    },
    closetishi() {
        this.tishi.scale = 0
    }
    // update (dt) {},
});
