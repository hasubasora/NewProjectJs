module.exports = {
    GetUserDatas(_fn) {
        let d = cc.sys.localStorage.getItem('SJ')
        console.log(!d)
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

        if (ds != 'undefined') {
            Global.DataUsers.sBalance = ds.Balance;
            Global.DataUsers.sNickName = ds.NickName;
            Global.DataUsers.sInvitationCode = ds.InvitationCode;
            Global.DataUsers.sLogin = ds.Login;
            Global.DataUsers.sToken = ds.Token;
            Global.DataUsers.sUserIcon = ds.UserIcon;
            Global.DataUsers.sUserId = ds.UserId;
            Global.DataUsers.sUserName = ds.UserName;
            Global.DataUsers.wsUrl = ds.wsUrl
        }

        if (ds == 'undefined') {
            module.exports.GoLoadScene('Home')
        }
    },
    RoomUserLen: 0,
    Audios: '',
    //房间数据
    _StageData: '',
    //保存游戏中的用户数据
    GameRoomData: '',
    //保存金额列表
    _Golds: '',

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
    }
};

