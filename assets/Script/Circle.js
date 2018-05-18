// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let newNode = cc.director.getScene().getChildByName('Canvas')
        let WebView = cc.find("bg/WebView", newNode).getComponent(cc.WebView)
        let xhr = cc.loader.getXMLHttpRequest()
        let _data = {
            client: 1,
            clientVersion: '0.0.1'
        }
        Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Common/getversion", _data, e => {
            let json = JSON.parse(e)

            console.log(json.object.circleUrl);
            // WebView.url = json.object.circleUrl + '/?tok=' + Global.DataUsers.sToken + '&usid=' + Global.DataUsers.sUserId
            // WebView.url = 'http://localhost:6667/?tok=' + Global.DataUsers.sToken + '&usid=' + Global.DataUsers.sUserId
            WebView.url = 'http://192.168.1.106:802/?tok=' + Global.DataUsers.sToken + '&usid=' + Global.DataUsers.sUserId
            console.log(WebView.url)
            console.log('--------------------------------------------------')
        })




    },

    // update (dt) {},
});
