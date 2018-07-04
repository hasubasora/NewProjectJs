

 cc.Class({
    extends: cc.Component,

    properties: {
        GameOverPoint: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    init() {
        this.GameOverPoint.string = Global._bollPointString.string
    },
    start() {

    },

    // update (dt) {},
});
