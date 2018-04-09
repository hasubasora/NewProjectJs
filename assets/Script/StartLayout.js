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
    LoadTime: {
      default: null,
      type: cc.Sprite
    },
    //huatiao
    action_time: 60,
    //daojishi
    action_times: 60,
    TimesOut: {
      default: null,
      type: cc.Label
    },

    //掉落节点
    Centers: cc.Node,
    toy: {
      default: [],
      type: cc.Node
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    //   this.sp=this.getComponent(cc.Sprite)

    this.TimeOuts();
    for (let toys = 0; toys < this.toy.length; toys++) {
      switch (toys) {
        case 0:
          let Centers1 = cc.moveBy(50, cc.p(100, -100));
          this.toy[0].runAction(Centers1);
          break;
        case 1:
          let Centers2 = cc.moveBy(40, cc.p(100, 100));
          this.toy[1].runAction(Centers2);
          break;
        case 2:
          let Centers3 = cc.moveBy(50, cc.p(100, 100));
          this.toy[2].runAction(Centers3);
          break;
        case 3:
          let Centers4 = cc.moveBy(40, cc.p(100, 90));
          this.toy[3].runAction(Centers4);
          break;
        default:
          break;
      }
    }
    let Centers = cc.moveBy(0.2, cc.p(0, -500)).easing(cc.easeInOut(3.0));
    this.Centers.runAction(Centers);

    console.log('开始匹配')
    this.now_time = 0;
  },

  CallOff() {
    this.node.destroy()
  },
  TimeOuts() {
    this.t = function () {
      if (this.action_times === 0) {
        // 在第六次执行回调时取消这个计时器
        this.unschedule(this.t);
      } else {
        // 这里的 this 指向 component
        let x = this.action_times - 1;
        this.TimesOut.string = x + "s";
        this.action_times = x;
      }
    };
    this.schedule(this.t, 1);
  },


  update(dt) {
    if (this.action_times != 0) {
      //倒计时

      this.now_time += dt;
      console.log(this.now_time )
      
      // var percent = this.now_time / this.action_time; //百分比
      var percent = this.now_time / this.action_time

      // console.log(this.action_times--);
      if (percent <= 0) {
        percent = 1;
        this.now_time = this.action_time; //从新开始
      }
      this.LoadTime.fillRange = -percent;
    }
  }
});
