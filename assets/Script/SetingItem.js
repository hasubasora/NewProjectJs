
cc.Class({
  extends: cc.Component,

  properties: {
    /**
     * 音效设置
     */
    Music: cc.Slider,
    Sounds: cc.Slider,
    scrollView: {
      default: null,
      type: cc.ScrollView
    },
    scrollView2: {
      default: null,
      type: cc.ScrollView
    },
    scrollView3: {
      default: null,
      type: cc.ScrollView
    },
    spawnCount: 10, // how many items we actually spawn
    totalCount: 0, // how many items we need for the whole list
    itemTemplate: { // item template to instantiate other items
      default: null,
      type: cc.Node
    },
    addressItem: {
      get: function () {
        return this._width;
      },
      set: function (value) {
        this._width = value;
      }
    },
    /**
     * 省市区按钮
     */
    Sheng: cc.Button,
    ShengID: 0,
    Shi: cc.Button,
    ShiID: 0,
    Qu: cc.Button,
    QuID: 0,
    /**
     * 地址信息
     */
    address: cc.EditBox,
    addressTel: cc.EditBox,
    addressName: cc.EditBox,
    /**
     * 支付信息
     */
    PayTab: cc.Button,            //切换支付宝和银行
    PayCard: cc.Button,           //获取银行信息
    PayCardId: 0,                 //银行ID
    CardNumber: cc.EditBox,       //身份证
    bankCard: cc.EditBox,         //银行卡
    bankCardName: cc.EditBox,     //名字
    CardName: cc.EditBox,         //名字
    alipayCard: cc.EditBox,       //支付宝
    radioButton: {                //切换支付宝银行list
      default: [],
      type: cc.Toggle
    },
    EditBoxList1: cc.Node,        //银行卡页
    EditBoxList2: cc.Node,        //支付宝页
    scrollViewCard: {             //银行滚动list
      default: null,
      type: cc.ScrollView
    },
    togglePay: cc.Node,
    sign: 1,                     //标示银行和收货地址切换
    signPay: 1,                   //银行和支付宝切换id 

    radioButtonTabs: {
      default: [],
      type: cc.Toggle
    },
    SaveBtn: cc.Button
  },


  onLoad() {
    this.items = [];
    this.content = this.scrollView.content;
    this.content2 = this.scrollView2.content;
    this.content3 = this.scrollView3.content;
    this.GetMessges()
    this.GetPayInfo()
    this.GetBankListPost()

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
  /**
   * 退出登录
   */
  LoginOut() {
    let data = {
      userid: Global.DataUsers.UserId
    }, xhr = cc.loader.getXMLHttpRequest()
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + '/account/logout', data, e => {
      console.log('退出')
      if (e) {
        cc.sys.localStorage.removeItem('SJ')
      }
    })

  },

  ShengBotton() {
    this.scrollView.node.scale = 1
    this.scrollView.node.zIndex = 1;
    this.GetAddress(1, e => {
      this.itemclick(e, this.content, 1)
      this.Shi.getComponentInChildren(cc.Label).string = ''
      this.Qu.getComponentInChildren(cc.Label).string = ''
      this.Shi.interactable = false;
      this.Qu.interactable = false;
    })
  },
  ShiBotton() {
    this.scrollView2.node.scale = 1
    this.scrollView2.node.zIndex = 1;
    this.GetAddress(this.ShengID, e => {
      this.itemclick(e, this.content2, 2)
    })
  },
  QuBotton() {
    this.scrollView3.node.zIndex = 1;
    this.scrollView3.node.scale = 1
    this.GetAddress(this.ShiID, e => {
      this.itemclick(e, this.content3, 3)
    })
  },
  GetAddress(pid, fn) {
    console.log(pid)
    let xhr = cc.loader.getXMLHttpRequest()
    let _data = {
      Token: Global.DataUsers.Token,
      Userid: Global.DataUsers.UserId,
      ParentID: pid
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Address/GetLstAreasInfo", _data, e => {
      fn(e)
    })

  }
  ,//this.content,this.ShiID
  itemclick(e, content, ParentID) {
    content.removeAllChildren();
    var addressObj = JSON.parse(e).object;
    this.addressItem = JSON.parse(e).object;
    var nodeLabel = new cc.Node('Label');
    var Label = nodeLabel.addComponent(cc.Label);
    for (let i = 0; i < addressObj.length; ++i) { // spawn items, we only need to do this once
      Label.string = addressObj[i].Name;
      Label.fontSize = 20;
      Label.fontSize = 25;
      let item = cc.instantiate(nodeLabel);
      item.index_target = addressObj[i].Areas_ID;
      content.addChild(item);
      this.items.push(item);
      item.on(cc.Node.EventType.TOUCH_END, (event) => {
        console.log(event.target.index_target);
        console.log('Mouse down--------------------------------------------' + addressObj[i].Name);
        if (ParentID == 1) {
          this.scrollView.node.scale = 0;
          this.scrollView.node.zIndex = -1;
          this.Sheng.getComponentInChildren(cc.Label).string = addressObj[i].Name;
          this.ShengID = event.target.index_target;
          this.Shi.interactable = true;
        }
        if (ParentID == 2) {
          this.scrollView2.node.scale = 0;
          this.scrollView2.node.zIndex = -1;
          this.Shi.getComponentInChildren(cc.Label).string = addressObj[i].Name;
          this.ShiID = event.target.index_target;
          this.Qu.interactable = true;
        }
        if (ParentID == 3) {
          this.scrollView3.node.scale = 0;
          this.scrollView3.node.zIndex = -1;
          this.Qu.getComponentInChildren(cc.Label).string = addressObj[i].Name;
          this.QuID = event.target.index_target;
        }
      }, this);
    }

  }
  ,
  /**
   * 保存信息
   */
  SaveMessges() {
    let xhr = cc.loader.getXMLHttpRequest()
    if (this.sign == 2) {
      let _data = {
        Userid: Global.DataUsers.UserId,
        Token: Global.DataUsers.Token,
        ID: 0,
        Province: this.ShengID ? this.ShengID : 0,
        City: this.ShiID ? this.ShiID : 0,
        Area: this.QuID ? this.QuID : 0,
        ProvinceName: this.Sheng.getComponentInChildren(cc.Label).string,
        CityName: this.Shi.getComponentInChildren(cc.Label).string,
        AreaName: this.Qu.getComponentInChildren(cc.Label).string,
        DetailAddress: this.address.string,
        contactName: this.addressName.string,
        MobilePhone: this.addressTel.string,
        isDefault: true
      }
      Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Address/SaveUserAddress", _data, e => { })
    }
    if (this.sign == 1) {
      console.info(this.sign)
      if (this.signPay == 1) {
        this.BindAlipayAccount()
      }
      if (this.signPay == 2) {
        this.BindBankCard()
      }
    }

  },
  GetMessges() {
    let xhr = cc.loader.getXMLHttpRequest()
    let _data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,
      PageIndex: 1,
      PageSize: 1
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Address/GetUserAddressList", _data, e => {
   
      let obj = JSON.parse(e).object
      if (!obj) {
        this.address.string = obj[0].DetailAddress
        this.addressName.string = obj[0].contactName
        this.addressTel.string = obj[0].MobilePhone
        this.Sheng.getComponentInChildren(cc.Label).string = obj[0].ProvinceName
        this.Shi.getComponentInChildren(cc.Label).string = obj[0].CityName
        this.Qu.getComponentInChildren(cc.Label).string = obj[0].AreaName
      }
    })
  },
  // 地址 end


  /***
   * 支付信息
   */
  //%.17绑定支付宝账号信息
  BindAlipayAccount() {
    let xhr = cc.loader.getXMLHttpRequest()
    let _data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,
      TrueName: this.CardName.string,
      AlipayAccount: this.alipayCard.string
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/account/BindAlipayAccount", _data, e => {

    })
  },
  //%.18绑定银行卡信息
  BindBankCard() {
    if (this.PayCardId != 0) {
      let xhr = cc.loader.getXMLHttpRequest()
      let _data = {
        Userid: Global.DataUsers.UserId,
        Token: Global.DataUsers.Token,
        AccountName: this.bankCardName.string,
        AccountNumber: this.bankCard.string,
        BankID: this.PayCardId,
        DocumenCode: this.CardNumber.string
      }
      Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/account/BindBankCard", _data, e => {
        if (JSON.parse(e).code != 12000) {
          this.alertWindw(JSON.parse(e).message)
        }
        if (JSON.parse(e).code == 12000) {
          this.alertWindw(JSON.parse(e).message)
        }
      })
    } else {
      this.alertWindw('选择银行')
    }
  },
  //%.19获取支付信息
  GetPayInfo() {
    let xhr = cc.loader.getXMLHttpRequest()
    let _data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,

    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/account/GetPayInfo", _data, e => {

      let _e = JSON.parse(e).object
      this.CardName.string = _e.TrueName
      this.alipayCard.string = _e.AlipayAccount
      this.bankCardName.string = _e.AccountName
      this.bankCard.string = _e.AccountNumber
      this.CardNumber.string = _e.DocumenCode
    })
  },
  //%.20获取银行信息
  GetBankList() {
    this.scrollViewCard.node.scale = 1
    this.scrollViewCard.node.zIndex = 1;
  },

  GetBankListPost(){
    let xhr = cc.loader.getXMLHttpRequest()
    let _data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/account/GetBankList", _data, e => {
      this.scrollViewCard.content.removeAllChildren();
      let addressObj = JSON.parse(e).object;
      let nodeLabel = new cc.Node('Label');
      let Label = nodeLabel.addComponent(cc.Label);
      for (let i = 0; i < addressObj.length; ++i) { // spawn items, we only need to do this once
        Label.string = addressObj[i].EnumDisplayText;
        Label.fontSize = 20;
        Label.fontSize = 25;
        let item = cc.instantiate(nodeLabel);
        item.index_target = addressObj[i].EnumValue;
        this.scrollViewCard.content.addChild(item);
        item.on(cc.Node.EventType.TOUCH_END, (event) => {
          console.log(event.target.index_target);
          // console.log('Mouse down--------------------------------------------' + addressObj[i].EnumDisplayText);
          this.scrollViewCard.node.scale = 0;
          this.scrollViewCard.node.zIndex = -1;
          this.PayCard.getComponentInChildren(cc.Label).string = addressObj[i].EnumDisplayText;
          this.PayCardId = event.target.index_target;
        }, this);
      }
    })
  },
  /**
   * 切换
   */
  radioButtonClicked: function (toggle) {
    var index = this.radioButton.indexOf(toggle);
    switch (index) {
      case 0:
        //支付宝
        this.PayTab.getComponentInChildren(cc.Label).string = '支付宝'
        this.EditBoxList1.scale = 0
        this.EditBoxList2.scale = 1
        this.PayCard.node.scale = 0
        this.togglePay.scale = 0
        this.signPay = 1
        console.log('支付宝')
        break;
      case 1:
        //银行
        this.PayTab.getComponentInChildren(cc.Label).string = '银行'
        this.EditBoxList2.scale = 0
        this.EditBoxList1.scale = 1
        this.PayCard.node.scale = 1
        this.togglePay.scale = 0
        this.signPay = 2
        console.log('银行')
        break;
      case 2:
        break;
      default:
        break;
    }
  },
  radioButtonClickedTab(toggle) {
    var index = this.radioButtonTabs.indexOf(toggle);
    switch (index) {
      case 0:
        // console.log('1')
        break;
      case 1:
        this.sign = 1
        // console.log('账户信息')
        break;
      case 2:
        this.sign = 2
        // console.log('地址信息')
        break;
      case 3:
        // console.log('3')
        break;
      default:
        break;
    }
  },
  PayTabButton() {
    this.togglePay.scale = 1
  },
  changed() {
    if (this.CardName.string && this.alipayCard.string) {
      this.SaveBtn.interactable = true
    } else {
      this.SaveBtn.interactable = false
    }


  },
  CardChanged() {
    if (this.CardNumber.string && this.bankCard.string && this.bankCardName.string) {
      this.SaveBtn.interactable = true
    } else {
      this.SaveBtn.interactable = false
    }
  },


  alertWindw(msg) {
    let windowLabel = new cc.Node('Label');
    let wLabel = windowLabel.addComponent(cc.Label);
    wLabel.string = msg
    windowLabel.color = new cc.Color(255, 0, 0)
    windowLabel.zIndex = 999;
    windowLabel.opacity = 0;
    windowLabel.setPosition(cc.p(cc.director.getScene().getChildByName('Canvas').width / 2, cc.director.getScene().getChildByName('Canvas').height / 2))
    cc.director.getScene().addChild(windowLabel)
    windowLabel.runAction(cc.sequence(
      cc.delayTime(0.5),
      cc.fadeIn(0.5),
      cc.delayTime(0.5),
      cc.fadeOut(1),
      cc.tintTo(2, 255, 255, 255)
    ));
  }
});
