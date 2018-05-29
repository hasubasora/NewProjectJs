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
        itemTemplate: { // item template to instantiate other items
            default: null,
            type: cc.Prefab
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        spawnCount: 2, // how many items we actually spawn
        spacing: 0, // space between each item
        totalCount: 0, // how many items we need for the whole list
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.content = this.scrollView.content;
        this.items = []; // array to store spawned items

        let _data = {
            token: Global.DataUsers.sToken,
            userid: Global.DataUsers.sUserId,
            roomId: Global._StageData.Data
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/caileigame/GetThunderTrades", _data, e => {
            let _e = JSON.parse(e);
            let e_list = _e.object.List
            this.initialize(_e.object.List);

        })
    },
    initialize(List) {
        let DataLists = List
        // this.content.height = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing; // get total content height
        this.content.height = 45 * this.spawnCount
        for (let i = 0; i < this.spawnCount; ++i) { // spawn items, we only need to do this once
            let item = cc.instantiate(this.itemTemplate);
            console.log(DataLists[i].UserID)
            let _item = item.getComponentsInChildren(cc.Label)
            _item[0].string = 'ID:' + DataLists[i].UserID
            _item[1].string = DataLists[i].PlusAmount
            // _item[2].string = "第" + (i + 1) + "名"
            _item[2].string = ""
            this.content.addChild(item);
            item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
            // item.getComponent('Item').updateItem(i, i);
            this.items.push(item);
        }
    },
    GoToStart(){
        cc.director.loadScene("GameStart");
    },
    start() {

    },

    // update (dt) {},
});
