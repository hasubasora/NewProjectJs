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
    //商品节点
    slotPrefab: {
      default: null,
      type: cc.Prefab
    },
    //滚动视图
    scrollView: {
      default: null,
      type: cc.ScrollView
    },
    //列表大小
    totalCount: 0
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {},
//循环
  init(home) {
    this.heroSlots = [];
    this.home = home;
    for (let i = 0; i < this.totalCount.length; ++i) {
      let heroSlot = this.addHeroSlot();
      this.heroSlots.push(heroSlot);
    }
  },
  addHeroSlot() {
    //添加到场景
    let heroSlot = cc.instantiate(this.slotPrefab);
    this.scrollView.content.addChild(heroSlot);
    return heroSlot;
  },
  show() {
    this.node.emit("fade-in");
    this.home.toggleHomeBtns(false);
  },
  hide() {
    this.node.emit("fade-out");
    this.home.toggleHomeBtns(false);
  },
  start() {}

  // update (dt) {},
});
