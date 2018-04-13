/**
 * 关闭弹窗用，挂载到父组件canvas
 */
cc.Class({
  extends: cc.Component,

  properties: {
    CloseWin: {
      default: null,
      type: cc.Node
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.CloseWin.on("touchstart", this.CloseWins, this);
  },

  CloseWins() {
      this.node.removeFromParent();
  }

  // update (dt) {},
});
