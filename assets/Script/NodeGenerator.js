cc.Class({
    extends: cc.Component,

    properties: {
        prefab: cc.Prefab,
        hint: cc.Label,
        regionOrigin: cc.Vec2,
        regionSize: cc.Size
    },

    // use this for initialization
    onLoad: function () {
        this.schedule(this.generateNode, 1);
        console.log('-----------------------1---------------------');
        this._pool = new cc.NodePool('PoolHandler');　//创建对象池
        this._count = 0;


        let windowSize = cc.view.getVisibleSize();
        cc.log("width=" + windowSize.width + ",height=" + windowSize.height);;
        windowSize = cc.winSize;//推荐  原因  短  
        cc.log("width=" + windowSize.width + ",height=" + windowSize.height);

    },

    generateNode: function () {
        var monster = this._pool.get(); //从对象池里面获取
        if (!monster) { //如果对象池没这个节点就实例化
            monster = cc.instantiate(this.prefab);
            this._count++;
            // this.hint.string = 'Node Created: ' + this._count;

            // Add pool handler component which will control the touch event
            monster.addComponent('PoolHandler');
        }
        // monster.x = this.regionOrigin.x + Math.floor(Math.random() * this.regionSize.width);
        // monster.x = Math.floor(Math.random() * (300 - 100) + 100);
        monster.x = cc.random0To1() * (cc.winSize.width - 100) + 100;
        monster.y = this.regionOrigin.y + Math.floor(Math.random() * this.regionSize.height);
        console.log(monster.x);
        // console.log(monster.getPositionX());

        var angle = Math.random() * Math.PI * 2;

        var dx = 500 * Math.cos(angle);
        var dy = 500 * Math.sin(angle);

        monster.runAction(cc.sequence(
            cc.moveBy(1, 0, 0),
            cc.callFunc(this.removeNode, this, monster)
        ));

        this.node.addChild(monster); //添加到节点树
    },

    removeNode: function (sender, monster) {
        this._pool.put(monster); //回收节点
    }
});
