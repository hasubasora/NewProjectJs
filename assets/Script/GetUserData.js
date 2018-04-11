module.exports = {
    GetUserDatas(_fn) {
        let d = cc.sys.localStorage.getItem('SJ')
        if (!d) {
            return;
        }
        let ds = JSON.parse(decodeURIComponent(d))
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            token: ds.Token,
            userid: ds.UserId
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                let _fn = _fn || function () {

                }
                _fn(response)
            }
        };
        xhr.open("POST", "http://localhost:11072/account/getuserinfo", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.send("data=" + JSON.stringify(_data))
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
    SignInBoxLeft(node,TelBox) {
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
    }

}

