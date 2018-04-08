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
    //  音效设置
    Music: cc.Slider,
    Sounds: cc.Slider,
    music: cc.AudioSource
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    console.log(this.node.parent.getComponent(cc.AudioSource));
    console.log(this.parent);
    this.getComponent(cc.AudioSource);
    this.Music.progress = 1;
    this.Sounds.progress = 1;
    // this._updateImageOpacity(this.slider_v.progress);
    // this._updateMusicVolume(this.Music.progress);
  },

  // _updateImageOpacity(progress) {
  //   this.image.opacity = progress * 255;
  // },

  // _updateMusicVolume(progress) {
  //   this.music.volume = progress;
  // },

  // onSliderVEvent(sender, eventType) {
  //   this._updateImageOpacity(sender.progress);
  // },

  // onSliderHEvent(sender, eventType) {
  //   this._updateMusicVolume(sender.progress);
  // }
  // update (dt) {},
});
