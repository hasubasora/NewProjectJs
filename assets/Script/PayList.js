// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import { GetUserDatas } from "GetUserData";
cc.Class({
    extends: cc.Component,

    properties: {
        moneybk: cc.Node,
        radioTabPay: {
            default: [],
            type: cc.Toggle
        },
        PayTypeID: 0,
        object: ''
    },
    onLoad() {
        GetUserDatas()
        if (Global.DataUsers!=null) {
            this.PayList()
        }
    },
    start() {
      
    },
    PayList() {
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            Channel: ''
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Transaction/GetPayList", _data, e => {
            this.object = JSON.parse(e).object

            for (let i = 0; i < this.object.length; i++) {
                this.radioTabPay[i].node.scale = 1
                // console.log(this.radioTabPay[i].node.getChildByName('mLabel'));
                this.radioTabPay[i].node.getChildByName('mLabel').getComponent(cc.Label).string = this.object[i].MerchantName
                Global.loaderUserIcon(this.object[i].Icon, this.radioTabPay[i].node.getChildByName('mSprite').getComponent(cc.Sprite))

                for (const iterator of this.object[i].Moneys) {
                    Global.loadPre('jbpre', fab => {
                        let PayTypeID = this.object[i].PayTypeID
                        fab.getChildByName('jbLabel').getComponent(cc.Label).string = iterator.Gold + '金币'
                        fab.getChildByName('jbm').getComponent(cc.Label).string = '￥' + iterator.Money
                        fab.on(cc.Node.EventType.TOUCH_END, (event) => {
                            this.SavePay(iterator.Gold, PayTypeID)
                        })
                        this.moneybk.addChild(fab);
                    })



                }

            }


        })
    },

    SavePay(money, PayTypeID) {
        console.log(money, PayTypeID);
        // window.location.href="http://www.baidu.com"
        let xhr = cc.loader.getXMLHttpRequest()
        if (PayTypeID != 0) {
            let _data = {
                Userid: Global.DataUsers.UserId,
                Token: Global.DataUsers.Token,
                Money: money,
                PayTypeID: PayTypeID,
                Channel: ''
            }
            Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Transaction/Pay", _data, e => {
                var div = document.createElement("div");
                div.className = 'wojiuzhidaohuigai'
                div.innerHTML = JSON.parse(e).object
                document.body.appendChild(div);
                document.PayForm.submit();

                this.scheduleOnce(function () {
                    document.getElementsByClassName('wojiuzhidaohuigai')[0].remove()
                }, 2);

                return
                // window.location.href = JSON.parse(e).code_url
            })
        }

    },
    radioTabs(toggle) {
        this.moneybk.removeAllChildren();
        var index = this.radioTabPay.indexOf(toggle);
        switch (index) {
            case 0:
                console.log('0')
                this.PayTypeID = this.object[0].PayTypeID
                for (const iterator of this.object[0].Moneys) {
                    cc.loader.loadRes("/prefab/money", (err, prefab) => {
                        var newNode = cc.instantiate(prefab);
                        newNode.getComponentInChildren(cc.Label).string = iterator
                        newNode.index_target = iterator
                        newNode.on(cc.Node.EventType.TOUCH_END, (event) => {
                            // console.log(event.target.index_target);
                            this.SavePay(event.target.index_target)
                        })
                        this.moneybk.addChild(newNode);
                    });
                }
                break;
            case 1:
                console.log('1')
                this.prefabMoney(1)
                break;
            case 2:
                console.log('2')
                this.PayTypeID = this.object[2].PayTypeID
                for (const iterator of this.object[2].Moneys) {
                    cc.loader.loadRes("/prefab/money", (err, prefab) => {
                        var newNode = cc.instantiate(prefab);
                        newNode.getComponentInChildren(cc.Label).string = iterator
                        newNode.index_target = iterator
                        newNode.on(cc.Node.EventType.TOUCH_END, (event) => {
                            // console.log(event.target.index_target);
                            this.SavePay(event.target.index_target)
                        })
                        this.moneybk.addChild(newNode);
                    });
                }
                break;
            case 3:
                console.log('3')
                break;
            default:
                break;
        }
    },
    prefabMoney(n) {
        this.PayTypeID = this.object[n].PayTypeID
        for (const iterator of this.object[n].Moneys) {
            cc.loader.loadRes("/prefab/money", (err, prefab) => {
                var newNode = cc.instantiate(prefab);
                newNode.getComponentInChildren(cc.Label).string = iterator
                newNode.index_target = iterator
                newNode.on(cc.Node.EventType.TOUCH_END, (event) => {
                    // console.log(event.target.index_target);
                    this.SavePay(event.target.index_target)
                })
                this.moneybk.addChild(newNode);
            });
        }
    }
    // update (dt) {},
});
