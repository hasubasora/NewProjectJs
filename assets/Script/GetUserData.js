module.exports = {
    GetUserDatas(ns) {
        if (cc.sys.localStorage.getItem('SJ') == 'undefined' || cc.sys.localStorage.getItem('SJ') == null) {
            Global.GoLoadScene()
            console.log('什么数据都没有');
            return
        }
        Global.DataUsers = JSON.parse(decodeURIComponent(cc.sys.localStorage.getItem('SJ')))
        let _data = {
            token: Global.DataUsers.Token,
            UserId: Global.DataUsers.UserId
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/account/getuserinfo", _data, e => {
            console.log('獲取用戶數據')
            let sData = JSON.parse(e)
            if (sData.code == 12000) {
                console.log(sData);
                cc.sys.localStorage.setItem("SJ", encodeURIComponent(JSON.stringify(sData.object)));
                Global.DataUsers = JSON.parse(JSON.stringify(sData.object))
                if (ns == 1) {
                    cc.director.loadScene('Home')
                    Global.lobbySocket()
                    // setTimeout(() => {
                    // }, 1000);
                }
            }
            if (sData.code == 12002) {
                cc.sys.localStorage.removeItem('SJ')
                return
            }
        })
        return;
    },
    WeixinLoginTime(tok) {
        let _data = {
            token: tok,
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/Weixin/WebLoginByToken", _data, e => {
            console.log('微信獲取用戶數據')
            let sData = JSON.parse(e)
            if (sData.code == 12000) {
                console.log(sData);
                console.log('微信獲取用戶數據成功')
                Global.DataUsers = JSON.parse(JSON.stringify(sData.object))
                cc.sys.localStorage.setItem("SJ", encodeURIComponent(JSON.stringify(sData.object)));
                Global.lobbySocket()
                cc.director.loadScene('Home')

            }
        })
        return true;
    },
    //登陆超时
    LoginTimeOut(outCode) {
        if (outCode != 12000) {
            cc.sys.localStorage.removeItem('SJ')
            Global.GoLoadScene()
            Global.ws.close()
            return;
        }
    },
    //登陆框移动方法
    SignInBoxRight(node, SignIn) {
        let Logins = cc.instantiate(SignIn);
        node.addChild(Logins, 100);
        Logins.setPosition(-node.width, 0);
        // let ViewWidth = node.width / 2 + SignIn.width / 2;
        let SignInBox = cc.moveBy(0.2, cc.p(node.width, 0));
        Logins.runAction(SignInBox);
    },
    //登陆框移动方法
    SignInBoxLeft(node, TelBox) {
        let PhoneViews = cc.instantiate(TelBox);
        node.parent.addChild(PhoneViews, 101);
        PhoneViews.setPosition(node.parent.width, 0);
        // var ViewWidth = node.parent.width / 2 + TelBox.width / 2;
        var SignInBox = cc.moveBy(1, cc.p(-node.parent.width, 0));
        PhoneViews.runAction(SignInBox);
    },
    DestroyNode(node) {
        node.destroy();
    },
    CloseWins(node) {
        node.removeFromParent();
    },
    //添加弹窗到场景
    AddWindow(node, prefab, x = 0, y = 0) {
        let obj = cc.instantiate(prefab);
        node.addChild(obj, 103);
        obj.setPosition(x, y);
    },
    // 场景跳转

}
// Global.streamXHREventsToLabel(xhr, "POST",Global.serverUrl + "/account/GetWebSocket", JSON.stringify(data),e=>{})
window.Global = {
    serverUrl: 'http://192.168.1.200:819',
    // serverUrl: 'http://192.168.1.168:819',
    // serverUrl: 'http://h5.huizhisuo.com',
    // serverUrl: 'http://h5.3dou.com',

    streamXHREventsToLabel: function (xhr, method, url, _data, _fn, async = true) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                _fn(response) || function (response) { }
                // console.log(response);
            }
        };
        xhr.open(method, url, async);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.send("data=" + JSON.stringify(_data))
    },
    DataUsers: null,
    online: 0,
    RoomUserLen: 0,
    Audios: '',
    //房间数据
    _StageData: '',
    //保存游戏中的用户数据
    GameRoomData: '',
    //保存金额列表
    _Golds: '',
    clientid: '',
    questions: 0,
    returnHome() {
        if (Global.DataUsers == null) {
            Global.GoLoadScene()
            return
        }
    },
    //加载头像图片
    loaderUserIcon(url, nSprite) {
        cc.loader.load({ url: url, type: 'png' }, function (err, tex) {
            if (err) {
                console.log(err);
                return;
            }
            nSprite.spriteFrame = new cc.SpriteFrame(tex);
        });
    },
    loadPre(pre, fn) {
        cc.loader.loadRes("/prefab/" + pre, (err, Prefab) => {
            if (err) {
                console.log(err)
                return;
            }
            var newNode = cc.instantiate(Prefab)
            fn(newNode)
        })
    },
    alertWindw(msg) {
        let windowLabel = new cc.Node('Label');
        let wLabel = windowLabel.addComponent(cc.Label);
        wLabel.string = msg
        windowLabel.color = new cc.Color(255, 0, 0)
        windowLabel.zIndex = 999;
        windowLabel.opacity = 0;
        windowLabel.setPosition(cc.p(cc.director.getScene().getChildByName('Canvas').width / 2, cc.director.getScene().getChildByName('Canvas').height / 2))
        cc.director.getScene().addChild(windowLabel)
        windowLabel.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.fadeIn(0.5),
            cc.delayTime(1),
            cc.fadeOut(1),
            cc.tintTo(2, 255, 255, 255)
        ));
    },
    socketMsg: '恭喜玩家空空获得1210金币',
    ws: '',
    GoLoadScene() {
        cc.director.loadScene('LoginPage')
    },
    lobbySocket() {
        console.log('连接sk');

        Global.ws = new WebSocket(Global.DataUsers.wsUrl);
        Global.ws.onopen = (event) => {
            console.log("サーバー　オペ");
            if (Global.ws.readyState === WebSocket.OPEN) {
                // var room = {
                //     Code: 100,
                //     Data: Global.DataUsers.UserId,
                //     Message: "用户登录"
                // };
                //Global.ws.send(JSON.stringify(room));
                console.log("WebSocket 用户登录...！");
            } else {
                console.log("WebSocket 准备好用户登录...！");
            }
        };
        Global.ws.onmessage = (event) => {
            let evMsg = JSON.parse(event.data)
            console.log("サーバーのメッセージ: " + event.data);
            Global.lobbyGetStatus(evMsg.Code, evMsg)

        };
        Global.ws.onerror = (event) => {
            console.log("メッセージ エッロ！！");
            // this.schedule(function () {
            //   // 这里的 this 指向 component
            //   this.doSomething();
            // }, 1, 99, 0);
        };
        Global.ws.onclose = (event) => {
            console.log("サーバー　オフ.");
        };

    },
    lobbyGetStatus(x, evMsg) { //sk里面的id
        switch (x) {
            case 100:
                Global.GoLoadScene()
                break;
            case 101:
                console.log('101')
                break;
            case 102:
                console.log('102')
                break;
            case 103:
                Global.socketMsg = '恭喜玩家' + evMsg.Data.UserDisplayName + '获得' + evMsg.Data.Profit + '金币'
                break;
            case 104:
                console.log('104')
                Global.online = evMsg.Data
                cc.sys.localStorage.setItem('online', evMsg.Data)
                // { "Success": true, "Data": 3, "Code": 104, "Message": "当前在线人数" }
                // Global.ws.close()
                break;
            default:
                cc.sys.localStorage.removeItem('SJ')
                Global.GoLoadScene()
                break;
        }
    },
    //获取收获
    GetMessges(fn) {
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            PageIndex: 1,
            PageSize: 1
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Address/GetUserAddressList", _data, e => {
            let obj = JSON.parse(e).object
            fn(obj)
        })
    },
    //qiuqiu
    _bollPoint: 0,
    _bollPointString: null,
    _bollSpeeds: 0,
    _bollTime: 0,
    _bollGameOver: null,
    _bollSpeed: -500,
    _bollMM: 0,
    _boll_Map_x1: 0,
    _boll_Map_x2: 0,
};

