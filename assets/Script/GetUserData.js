module.exports = {
    host: "ws://localhost",
    port: 9000,
    GetUserDatas(_fn) {
        let d = cc.sys.localStorage.getItem('SJ')
        if (!d) {
            return false;
        } else {
            let ds = JSON.parse(decodeURIComponent(d))
            let xhr = cc.loader.getXMLHttpRequest()
            let _data = {
                token: ds.Token,
                userid: ds.UserId
            }
            Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/account/getuserinfo", _data, e => {
                console.log('獲取用戶數據')
                Global.getDataUsers()
            })
            return true;
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
    }
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
    Audios:''
};

