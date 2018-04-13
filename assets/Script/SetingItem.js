

cc.Class({
  extends: cc.Component,

  properties: {
    //  音效设置
    Music: cc.Slider,
    Sounds: cc.Slider,
  },
  onLoad() {
    if (Global.Audios==''){
      Global.Audios = this.node.parent.getComponentInChildren(cc.AudioSource)
    }
    //音乐设置
    if (cc.sys.localStorage.getItem("Mic") != null) {
      this._updateMusicVolume(cc.sys.localStorage.getItem("Mic"));
      this.Music.progress = cc.sys.localStorage.getItem("Mic");
    } else {
      this._updateMusicVolume(this.Music.progress);
    }
  },
  /**
   * 音乐设置
   * @param {d} progress
   */
  _updateMusicVolume(progress) {
    console.log(Global.Audios.volume);
    Global.Audios.volume = progress;
    cc.sys.localStorage.setItem("Mic", progress);
  },
  onSliderHEvent(sender, eventType) {
    this._updateMusicVolume(sender.progress);
  },

});
