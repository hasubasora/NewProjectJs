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
                module.exports.LoginTimeOut(JSON.parse(e).code)
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
// Global.streamXHREventsToLabel(xhr, "POST",Global.serverUrl + "/account/GetWebSocket", JSON.stringify(data),e=>{})
window.Global = {
    serverUrl: 'http://localhost:11072',
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
        sBalance: 0,
        sInvitationCode: "",
        sLogin: 0,
        sNickName: "0",
        sToken: "",
        sUserIcon: "",
        sUserId: 0,
        sUserName: "0",
        swsUrl:''
    },
    getDataUsers() {
        let ds = JSON.parse(decodeURIComponent(cc.sys.localStorage.getItem('SJ')))
        if (ds != undefined) {
            Global.DataUsers.sBalance = ds.Balance;
            Global.DataUsers.sNickName = ds.NickName;
            Global.DataUsers.sInvitationCode = ds.InvitationCode;
            Global.DataUsers.sLogin = ds.Login;
            Global.DataUsers.sToken = ds.Token;
            Global.DataUsers.sUserIcon = ds.UserIcon;
            Global.DataUsers.sUserId = ds.UserId;
            Global.DataUsers.sUserName = ds.UserName;
            Global.DataUsers.wsUrl = ds.wsUrl;
        } else {
            module.exports.GoLoadScene('Home')
        }
    },
    RoomUser:0,
    Audios: '',
    //房间数据
    _StageData: '',
    //保存游戏中的用户数据
    GameRoomData: '',
    //保存金额列表
    _Golds:'',
    //长连接
    nSocket(_fnRun) {
        let _data = {
            token: Global.DataUsers.sToken,
            userid: Global.DataUsers.sUserId
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/account/GetWebSocket", _data, e => {
            console.log('獲取aWebSocket')
            var _e = JSON.parse(e)
            module.exports.LoginTimeOut(_e.code)
            var ws = new WebSocket("ws://192.168.1.200:200" + Global.DataUsers.sUserId % 1 + _e.object.path);
            ws.onopen = function (event) {
                console.log("サーバー　オペ");
            };
            ws.onmessage = function (event) {
                console.log("サーバーのメッセージ: " + event.data);
                let aData = JSON.parse(event.data).Data.Status
                let UserID = JSON.parse(event.data).Data.UserID
                Global.GetStatus(aData, UserID)

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
    },
    GetStatus(x, u) {
        switch (x) {
            case 0:
                console.log('什么宝物都没有')
                break;
            case 1:
                console.log('有人参战')
                break;
            case 2:
                console.log('有人观战')
                break;
            case 3:
                console.log('准备战斗')
                break;
            case 4:
                console.log('取消准备')
                break;
            case 5:
                console.log('开始游戏')
                break;
            case 6:
                Global.GameRoomData.forEach((v, i) => {
                    console.log(v.UserId == u)
                    if (v.UserId == u) {
                        //设置人物位置数据
                        console.log('-----------------------------------')

                        this.xUserNum = i + 2
                    }
                })
                console.log('上一层楼')
                break;
            case 7:
                console.log('停住')
                break;
            case 8:
                console.log('退出游戏')
                break;
            case 9:
                console.log('游戏结束')
                break;
            case 10:
                console.log('解散房间')
                break;
            case 11:
                console.log('要爆炸了')
                break;
            case 12:
                console.log('爆炸了')
                break;
            case 13:
                console.log('没死人')
                break;
            default:
                break;
        }
    }
};

