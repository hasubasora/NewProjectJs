

cc.Class({
  extends: cc.Component,

  properties: {
    //  音效设置
    Music: cc.Slider,
    Sounds: cc.Slider,
    scroll: cc.ScrollView
  },
  onLoad() {

    this.GetAddress()
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
  LoginOut() {
    let data = {
      userid: Global.DataUsers.sUserId
    }, xhr = cc.loader.getXMLHttpRequest()
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + '/account/logout', data, e => {
      console.log('退出')
      if (e) {
        cc.sys.localStorage.removeItem('SJ')
      }
    })

  },

  GetAddress() {
   let xhr = cc.loader.getXMLHttpRequest()
    let _data = {
      Token: Global.DataUsers.sToken,
      Userid: Global.DataUsers.sUserId,
      ParentID: 0
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Address/GetLstAreasInfo", _data, e => { console.log(e) })

  }




});
