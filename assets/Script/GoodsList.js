cc.Class({
  extends: cc.Component,

  properties: {
    //价格
    GoodsPrice: {
      default: null,
      type: cc.Label
    },
    GoodsName: {
      default: null,
      type: cc.Label
    },
    GoodsQuantity: {
      default: null,
      type: cc.Label
    },
    //图标
    SpIcon: {
      default: null,
      type: cc.Sprite
    },
    //图标集
    sfIcons: {
      default: [],
      type: cc.SpriteFrame
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    function getRandomInt(min, max) {
      let ratio = cc.random0To1();
      return min + Math.floor((max - min) * ratio);
    }
    this.GoodsPrice.string = "$" + getRandomInt(1, 100).toString();
    this.SpIcon.SpriteFrame = this.sfIcons[getRandomInt(0, this.sfIcons)];
  },

  start() {}

  // update (dt) {},
});
