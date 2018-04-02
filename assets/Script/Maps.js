cc.Class({
    extends: cc.Component,

    properties: {
        Maps: {
            default: null,
            type: cc.TiledMap,
        },
        hideLayer: {
            default: null,
            type: cc.TiledLayer,
        },
        mainLayer: {
            default: null,
            type: cc.TiledLayer,
        },
        Player: {
            default: null,
            type: cc.TiledLayer,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log(this.Maps.getMapSize())
        console.log(this.Maps.getObjectGroup())

    },

    start() {

    },

    // update (dt) {},
});