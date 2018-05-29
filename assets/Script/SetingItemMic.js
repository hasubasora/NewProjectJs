
cc.Class({
  extends: cc.Component,

  properties: {
    /**
     * 音效设置
     */
    Music: cc.Slider,
    Sounds: cc.Slider,
     
  },


  onLoad() {
    // this.scrollView.runAction(cc.moveTo(2, 100, 100));
    // console.log(this.content);

    // this.content.on(cc.Node.EventType.TOUCH_START, function (event) {

    //   console.log(event.target);
    //   // console.log(event.target._children[0].getComponent(cc.Label).string);
    //   console.log('Mouse down');
    // }, this);

    if (Global.Audios == '') {
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
    Global.Audios.volume = progress;
    cc.sys.localStorage.setItem("Mic", progress);
  },
  onSliderHEvent(sender, eventType) {
    this._updateMusicVolume(sender.progress);
  },
  

  
});
