cc.Class({
  extends: cc.Component,

  properties: {
    Returns: {
      default: null,
      type: cc.Node
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.Returns.on(
      "touchstart",
      function() {
        cc.director.loadScene("Home");
      },
      this
    );
  },

  start() {}

  // update (dt) {},
});
