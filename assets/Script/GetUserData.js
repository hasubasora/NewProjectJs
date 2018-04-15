module.exports = {
    GetUserDatas(_fn) {
        let d = cc.sys.localStorage.getItem('SJ')
        if (!d) {
            return false;
        } else {
            let ds = JSON.parse(decodeURIComponent(d))
            let _data = {
                token: ds.Token,
                userid: ds.UserId
            }
            Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/account/getuserinfo", _data, e => {
                console.log('獲取用戶數據')
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
    AddWindow(node, prefab) {
        let obj = cc.instantiate(prefab);
        node.addChild(obj, 103);
        obj.setPosition(0, 0);
    },
    // 场景跳转
    GoLoadScene(d) {
        cc.director.loadScene(d);
    },

}
// this.streamXHREventsToLabel(xhr, "POST", this.GetCodeUrl, JSON.stringify(data),e=>{})
window.Global = {
    serverUrl: 'http://localhost:11072',
    streamXHREventsToLabel: function (xhr, method, url, _data, _fn) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                _fn(response) || function (response) { }
                // console.log(response);
            }
        };
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.send("data=" + JSON.stringify(_data))
    },
    DataUsers: {
        sBalance: 0,
        sInvitationCode: "",
        sLogin: 0,
        sNickName: "0",
        sToken: "",
        sUserIcon: "",
        sUserId: 0,
        sUserName: "0"
    },
    getDataUsers() {
        let ds = JSON.parse(decodeURIComponent(cc.sys.localStorage.getItem('SJ')))
        Global.DataUsers.sBalance = ds.Balance;
        Global.DataUsers.sNickName = ds.NickName;
        Global.DataUsers.sInvitationCode = ds.InvitationCode;
        Global.DataUsers.sLogin = ds.Login;
        Global.DataUsers.sToken = ds.Token;
        Global.DataUsers.sUserIcon = ds.UserIcon;
        Global.DataUsers.sUserId = ds.UserId;
        Global.DataUsers.sUserName = ds.UserName;
    },
    Audios: '',
    //房间数据
    _StageData: '',
    
    //长连接
    nSocket() {
        let _data = {
            token: Global.DataUsers.sToken,
            userid: Global.DataUsers.sUserId
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/account/GetWebSocket", _data, e => {
            console.log('獲取aWebSocket')
            var _e = JSON.parse(e)
            console.log(_e.object.path)
            var ws = new WebSocket("ws://192.168.1.200:2000" + _e.object.path);
            ws.onopen = function (event) {
                console.log("サーバー　オペ");
            };
            ws.onmessage = function (event) {
                console.log("サーバーのメッセージ: " + event.data);
            };
            ws.onerror = function (event) {
                console.log("メッセージ エッロ！！");
            };
            ws.onclose = function (event) {
                console.log("サーバー　オフ.");
            };

            setTimeout(function () {
                if (ws.readyState === WebSocket.OPEN) {
                    var room = {
                        Code: 101,
                        Data: {
                            roomId: Global._StageData.Data,
                            userId: Global.DataUsers.sUserId,
                        }
                    };
                    ws.send(JSON.stringify(room));
                } else {
                    console.log("WebSocket instance wasn't ready...！");
                }
            }, 3);
        })
    }
};

