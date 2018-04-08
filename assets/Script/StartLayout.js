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
    StartSp: {
      default: null,
      type: cc.Button
    },
    LoadTime: {
      default: null,
      type: cc.Sprite
    },
    action_time: 60,
    action_times: 60,
    TimesOut: {
      default: null,
      type: cc.Label
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    //   this.sp=this.getComponent(cc.Sprite)
    this.now_time = 0;
    this.TimeOuts();
  },
  TimeOuts() {
    this.t = function() {
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
  // start() {}

  update(dt) {
    if (this.action_times != 0) {
      //倒计时
      this.now_time -= dt;
      var percent = this.now_time / this.action_time; //百分比
      // console.log(this.action_times--);
      if (percent <= 0) {
        percent = 1;
        this.now_time = this.action_time; //从新开始
      }
      this.LoadTime.fillRange = percent;
    }
  }
});
