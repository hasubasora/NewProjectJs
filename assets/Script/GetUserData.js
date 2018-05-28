module.exports = {
    GetUserDatas(_fn) {
        let d = cc.sys.localStorage.getItem('SJ')
        console.log(!d)
        if (d == 'undefined') {
            return false;
        }
        if (d) {
            let ds = JSON.parse(decodeURIComponent(d))
            let _data = {
                token: ds.Token,
                userid: ds.UserId
            }
            Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/account/getuserinfo", _data, e => {
                console.log('獲取用戶數據')
                module.exports.LoginTimeOut(JSON.parse(e).code)
                let sData = JSON.parse(e)
                cc.sys.localStorage.setItem("SJ", encodeURIComponent(JSON.stringify(sData.object)));
                Global.getDataUsers()
            })
            return true;
        }

    },
    //登陆超时
    LoginTimeOut(outCode) {
        if (outCode != 12000) {
            cc.sys.localStorage.removeItem('SJ')
            module.exports.GoLoadScene('Home')
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
        var SignInBox = cc.moveBy(0.2, cc.p(-node.parent.width, 0));
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
    GoLoadScene(d) {
        // cc.sys.localStorage.removeItem('SJ')
        cc.director.loadScene(d);
    },
}
// Global.streamXHREventsToLabel(xhr, "POST",Global.serverUrl + "/account/GetWebSocket", JSON.stringify(data),e=>{})
window.Global = {
    // serverUrl: 'http://192.168.1.200:819',
    // serverUrl: 'http://192.168.1.168:819',
    serverUrl: 'http://h5.hd4yx0.cn',
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
    DataUsers: {
        sBalance: cc.sys.localStorage.getItem('sBalance'),
        sInvitationCode: "",
        sLogin: 0,
        sNickName: "0",
        sToken: "",
        sUserIcon: "",
        sUserId: 0,
        sUserName: "0",
        swsUrl: ''
    },
    getDataUsers() {
        let ds = JSON.parse(decodeURIComponent(cc.sys.localStorage.getItem('SJ')))
        console.log(ds)
        if (ds) {
            Global.DataUsers.sBalance = ds.Balance;
            Global.DataUsers.sNickName = ds.NickName;
            Global.DataUsers.sInvitationCode = ds.InvitationCode;
            Global.DataUsers.sLogin = ds.Login;
            Global.DataUsers.sToken = ds.Token;
            Global.DataUsers.sUserIcon = ds.UserIcon;
            Global.DataUsers.sUserId = ds.UserId;
            Global.DataUsers.sUserName = ds.UserName;
            Global.DataUsers.wsUrl = ds.wsUrl
            if (Global.DataUsers.wsUrl !='undefined') {
                Global.lobbySocket()
            }
        }
        if (ds == null) {
            module.exports.GoLoadScene('Home')
        }
        if (ds == 'undefined') {
            module.exports.GoLoadScene('Home')
        }
    },
    online: 0,
    RoomUserLen: 0,
    Audios: '',
    //房间数据
    _StageData: '',
    //保存游戏中的用户数据
    GameRoomData: '',
    //保存金额列表
    _Golds: '',
    clientid:'',
    questions: 0,
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
    lobbySocket() {
        Global.ws = new WebSocket(Global.DataUsers.wsUrl);
        Global.ws.onopen = (event) => {
            console.log("サーバー　オペ");
            if (Global.ws.readyState === WebSocket.OPEN) {
                // var room = {
                //     Code: 100,
                //     Data: Global.DataUsers.sUserId,
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
            // console.log("サーバーのメッセージ: " + event.data);
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
                module.exports.GoLoadScene('Home')
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
                // { "Success": true, "Data": 3, "Code": 104, "Message": "当前在线人数" }
                Global.ws.close()

                break;
            default:
                cc.sys.localStorage.removeItem('SJ')
                module.exports.GoLoadScene('Home')
                break;
        }
    },
};

