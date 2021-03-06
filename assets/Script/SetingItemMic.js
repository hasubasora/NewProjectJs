
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

    // if (Global.Audios == '') {
    //   Global.Audios = this.node.parent.getComponentInChildren(cc.AudioSource)
    // }

    //音乐设置
    if (cc.sys.localStorage.getItem("Mic") != null) {
      this._updateMusicVolume(cc.sys.localStorage.getItem("Mic"));
      this.Music.progress = cc.sys.localStorage.getItem("Mic");
    } else {
      this._updateMusicVolume(this.Music.progress);
    }


    if (cc.sys.localStorage.getItem("Sou") != null) {
      this._updateAudiosVolume(cc.sys.localStorage.getItem("Sou"));
      this.Sounds.progress = cc.sys.localStorage.getItem("Sou");
    } else {
      this._updateAudiosVolume(this.Sounds.progress);
    }


  },
  /**
   * 音乐设置
   * @param {d} progress
   */
  _updateMusicVolume(progress) {
    // Global.Audios.volume = progress;
    Global.GameAwait.volume = progress;
    Global.startTime.volume = progress
    Global.bombTimeSource.volume = progress
    cc.sys.localStorage.setItem("Mic", progress);
  },
  onSliderHEvent(sender, eventType) {
    this._updateMusicVolume(sender.progress);
  },


  _updateAudiosVolume(progress) {
    Global.timeStartSource.volume = progress
    Global.gameOver.volume = progress
    Global.gameWin.volume = progress
    Global.bombTime.volume = progress
    Global.goSource.volume = progress;
    cc.sys.localStorage.setItem("Sou", progress);
  },
  onSliderHEventAudios(sender, eventType) {
    this._updateAudiosVolume(sender.progress);
  },



});
