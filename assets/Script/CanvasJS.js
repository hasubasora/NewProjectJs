// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import { GetUserDatas, AddWindow, WeixinLoginTime } from "GetUserData";
cc.Class({
  extends: cc.Component,

  properties: {
    UserInfo: {
      default: null,
      type: cc.Node
    },
    UserInfoImg: {
      default: null,
      type: cc.Sprite
    },
    UserInfoId: {
      default: null,
      type: cc.Label
    },
    UserInfoName: {
      default: null,
      type: cc.Label
    },
    //用户信息
    InfoBox: {
      default: null,
      type: cc.Node
    },
    //设置
    Setings: {
      default: null,
      type: cc.Prefab
    },
    SetingsBtn: {
      default: null,
      type: cc.Node
    },
    //活动页面
    Activitys: {
      default: null,
      type: cc.Node
    },
    //商店
    ShopsBtn: {
      default: null,
      type: cc.Node
    },
    // 金币
    Gulds: {
      default: null,
      type: cc.Node
    },
    GuldsSetings: {
      default: null,
      type: cc.Node
    },
    Gold: cc.Label,

    Audios: cc.AudioSource,

    clikcMis: {
      type: cc.AudioSource,
      default: null
    },
    //??
    clickGameMis: {
      type: cc.AudioSource,
      default: null
    },

    TurnTheScreen: cc.Node,

    screenOrientation: '',
    sMsg: cc.Label,

    Invitations: cc.Node,//邀请

    // 二维码
    QcCode: cc.Sprite,
    buttomMsg: cc.Label,
    UserToName: cc.Label,
    UserToId: cc.Label,
    User_pic: cc.Sprite,

    TotalAmount: cc.Label,
    DirectlyUnderAmount: cc.Label,
    LowerMemberAmount: cc.Label,
    TotalCommission: cc.Label,
    DirectlyUnderCommission: cc.Label,
    LowerMemberCommission: cc.Label,


    sPageView: cc.PageView,
    sPageView_1: cc.Sprite,
    sPageView_2: cc.Sprite,
    sPageView_3: cc.Sprite,

    nlayer: cc.Node,

    myScrollView: cc.ScrollView,
    AgentScrollView: cc.ScrollView,

    qrCodeUrls: cc.Node,

    Extext: cc.Node,

    // 个人中心
    MyName: cc.EditBox,
    MyId: cc.Label,
    MyIcon: cc.Sprite,
    QsNumber: cc.Label,
    ThunderNumber: cc.Label,
    PigNumber: cc.Label,
    QsWinNumber: cc.Label,
    ThWinNumber: cc.Label,

    ByGolds: cc.ScrollView,
    BsGolds: cc.ScrollView,

    ThunderScroll: cc.ScrollView,
    QuestionScroll: cc.ScrollView,

  },

  // LIFE-CYCLE CALLBACKS:

  modification() {
    let sss = this.Extext.getComponent(cc.EditBox).string
    //   this.Extext.removeComponent(cc.EditBox)
    //  let txt= this.Extext.addComponent(cc.Label)
    //   txt.string  = '787878'
    // console.log(this.Extext.getComponent(cc.EditBox));
    // console.log(this.Extext.getComponent(cc.Label).string);
    if (sss == '') {
      this.Extext.getComponent(cc.EditBox).string = Global.DataUsers.UserName
      return
    }
    let data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,
      UserName: sss
    }
    Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/account/UpdateUserName", data, e => {
      let code = JSON.parse(e)
      if (code.code == 12000) {
        this.GetUserCenter()
      }
    })
  },
  openUserInfo(e, num) {
    this.UserInfo.scale = num
    this.clikcMis.play()
  },
  getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  },
  onLoad() {

    if (cc.sys.localStorage.getItem("Mic") == null) {
      cc.sys.localStorage.setItem("Mic", 0.5);
    }
    // console.log(navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger");
    this.scheduleOnce(() => {
      this.SetInfo()
    }, 1);
    this.getversion()
    console.log(Global.DataUsers);
    if (Global.DataUsers != null) {
      GetUserDatas()
      //设置数据
      console.log('~~3~');
    }
    // 设置
    this.SetingsBtn.on("touchstart", this.SetingsFn, this);
    //活动界面
    this.Activitys.on("touchstart", this.ActivityWin, this);
    //金币
    this.Gulds.on("touchstart", this.AddWindows, this);
    //音乐初始化
    Global.Audios = this.Audios;
    Global.Audios.volume = cc.sys.localStorage.getItem("Mic");
    // //判断有没有账户
    // console.log(cc.sys.localStorage.getItem('SJ') != 'undefined');
    // console.log(cc.sys.localStorage.getItem('SJ') != null);

  },
  SetInfo() {
    if (Global.DataUsers == null) {
      return
    }
    console.log('设置数据');
    // console.log(Global.DataUsers);
    this.UserInfoName.string = Global.DataUsers.UserName;
    this.MyName.string = Global.DataUsers.UserName;
    this.MyId.string = 'ID:' + Global.DataUsers.Login;
    this.UserInfoId.string = 'ID:' + Global.DataUsers.Login;
    Global.loaderUserIcon(Global.DataUsers.UserIcon, this.UserInfoImg)
    Global.loaderUserIcon(Global.DataUsers.UserIcon, this.MyIcon)
    this.Gold.string = Global.DataUsers.Balance;
    this.GetInvitation()
    this.GetAgentRule()
    this.GetAgentDataStatisticsInfo()

    //个人中心 金币购买
    this.GetUserCenter()
    this.GetRecords(1)
    this.GetRecords(2)

    //游戏记录
    this.GetThunderTrades()
    this.getexamgamerecords()

  },
  addEventListeners() {
    this.checkOrient();
    window.onorientationchange = this.screenOrientation;
  },


  //通过window.orientation来判断设备横竖屏
  checkOrient() {
    let _this = this
    if (window.orientation == 0 || window.orientation == 180) {//竖屏的时候
      this.screenOrientation = 'portrait';
      // alert(window.orientation)
      _this.TurnTheScreen.scale = 1
    }
    else if (window.orientation == 90 || window.orientation == -90) {//横屏的时候
      this.screenOrientation = 'landscape';
      _this.TurnTheScreen.scale = 0
      // alert(window.orientation)
    }
  },
  GoGameStart(e, d) {
    cc.director.loadScene(d)
  },


  Invitation(e, n) {
    if (n == 1) {
      this.GetInvitation()
      this.GetAgentRule()
      this.GetAgentDataStatisticsInfo()
      this.GetParentAgentWeeklyTransaction(1)
      this.GetParentAgentWeeklyTransaction(2)
    }
    this.Invitations.scale = n
    this.clikcMis.play()
  },
  Shops() {
    cc.director.loadScene("Shop");
  },
  ActivityWin() {
    cc.director.loadScene("Activity");
  },

  AddWindows() {
    this.GuldsSetings.scale = 1
    this.clikcMis.play()
  },
  closeGuldsSetings() {
    this.GuldsSetings.scale = 0
    this.clikcMis.play()
  },
  SetingsFn() {
    let Infos = cc.instantiate(this.Setings);
    this.node.addChild(Infos, 104);
    Infos.setPosition(0, 0);
    this.clikcMis.play()
  },
  //SignIn
  GetPrefab(fab) {
    cc.loader.loadRes("/prefab/" + fab, (err, Prefab) => {
      if (err) {
        console.log(err)
        return;
      }
      var newNode = cc.instantiate(Prefab);
      newNode.setPosition(this.node.width / 2, this.node.height / 2);
      cc.director.getScene().addChild(newNode);
      // let _newNode = cc.find("sl/winText", newNode)
      // _newNode.getComponentsInChildren(cc.Label)[0].string = gold;
    });
  },

  CloseViews() {
    this.node.destroy()
  },
  start() {
  }
  ,
  GoToMsg() {
    cc.director.loadScene("News");
  },
  update(dt) {
    this.sMsg.string = Global.socketMsg
  },
  getversion() {
    var xhr = cc.loader.getXMLHttpRequest()
    let data = {
      "clientVersion": '0.0.1',
      "client": 0
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/common/getversion", data, e => {
      let code = JSON.parse(e)

      if (code.code == 12000) {


      }
    })
  },
  //二维码
  qrCodeUrlFn(e, num) {
    var nSprite = cc.instantiate(this.User_pic.node);
    nSprite.setPosition(cc.v2(0, 0))
    nSprite.scale = 2
    this.qrCodeUrls.addChild(nSprite)
    this.qrCodeUrls.scale = num;
  },
  //邀请                                                                               %.65获取代理本周佣金
  GetInvitation() {
    var xhr = cc.loader.getXMLHttpRequest()
    let data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Agent/GetWeeklyTransaction", data, e => {
      let code = JSON.parse(e)
      if (code.AccountType == 1) {
        this.ApplicationBroker()
      }
      if (code.code == 12000 && code.AccountType == 2) {
        let mo = code.model
        let ser = code.user
        let tips = code.tips
        this.UserToName.string = ser.UserName
        this.UserToId.string = ' ID:' + ser.Login
        this.TotalAmount.string = mo.TotalAmount
        this.DirectlyUnderAmount.string = mo.DirectlyUnderAmount
        this.LowerMemberAmount.string = mo.LowerMemberAmount
        this.TotalCommission.string = mo.TotalCommission
        this.DirectlyUnderCommission.string = mo.DirectlyUnderCommission
        this.LowerMemberCommission.string = mo.LowerMemberCommission
        this.buttomMsg.string = tips[0] + tips[1]
        Global.loaderUserIcon(code.qrCodeUrl, this.User_pic)
      }
    })
  },
  //                                                                                       %.64成为超级玩家
  ApplicationBroker() {
    var xhr = cc.loader.getXMLHttpRequest()
    let data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Agent/ApplicationBroker", data, e => {
      let code = JSON.parse(e)
      // console.log(code);
      if (code.code == 12000) {

      }
    })
  },
  //%.                                                                                      66获取代理周数据统计
  GetAgentDataStatisticsInfo() {
    var xhr = cc.loader.getXMLHttpRequest()
    let data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Agent/GetAgentDataStatisticsInfo", data, e => {
      let Agent = JSON.parse(e)
      if (Agent.code == 12000) {
        let AgentAll = Agent.model
        let AgentCount = this.nlayer.getChildByName('ask_list_one').getComponentsInChildren(cc.Label)
        AgentCount[0].string = '我的代理:' + AgentAll.ParentAgentCount
        AgentCount[1].string = '本周新增:' + AgentAll.WeekParentAgentCount
        AgentCount[2].string = '本月新增:' + AgentAll.MonthParentAgentCount

        let Counts = this.nlayer.getChildByName('ask_list_two').getComponentsInChildren(cc.Label)
        Counts[0].string = '我的代理:' + AgentAll.UserCount
        Counts[1].string = '本周新增:' + AgentAll.WeekCount
        Counts[2].string = '本月新增:' + AgentAll.MonthCount
      }
    })
  },
  // % .67获取直属代理
  GetParentAgentWeeklyTransaction(num) {
    if (num == 1) {
      this.myScrollView.content.removeAllChildren()
    }
    if (num == 2) {
      this.AgentScrollView.content.removeAllChildren()
    }
    var xhr = cc.loader.getXMLHttpRequest()
    let data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,
      PageIndex: 1,
      PageSize: 1,
      Type: num //1我的代理，2直属会员
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Agent/GetParentAgentWeeklyTransaction", data, e => {
      let Transaction = JSON.parse(e)
      if (Transaction.code == 12000) {
        // console.log(Transaction.List);
        for (const iterator of Transaction.List) {
          Global.loadPre('wlist', newNode => {
            Global.loaderUserIcon(iterator.Avatar, newNode.getChildByName('wSprite').getComponent(cc.Sprite))
            newNode.getChildByName('nLabel').getComponent(cc.Label).string = iterator.UserName;
            newNode.getChildByName('ILabel').getComponent(cc.Label).string = iterator.Login;
            newNode.getChildByName('yLabel').getComponent(cc.Label).string = iterator.Amount;
            if (num == 1) {
              this.myScrollView.content.addChild(newNode)
            }
            if (num == 2) {
              this.AgentScrollView.content.addChild(newNode)
            }
          })
        }
      }
    })
  },
  //%.69获取佣金规则
  GetAgentRule() {
    var xhr = cc.loader.getXMLHttpRequest()
    let data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/Agent/GetAgentRule", data, e => {
      let code = JSON.parse(e)
      if (code.code == 12000) {
        Global.loaderUserIcon(code.Data[0], this.sPageView_1)
        Global.loaderUserIcon(code.Data[1], this.sPageView_2)
        Global.loaderUserIcon(code.Data[2], this.sPageView_3)
      }
    })
  },



  // % .26获交易数据
  GetRecords(num) {
    this.ByGolds.content.removeAllChildren()
    this.BsGolds.content.removeAllChildren()
    let data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,
      PageIndex: 1,
      PageSize: 10,
      Type: num
    }
    Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/account/GetRecords", data, e => {
      let code = JSON.parse(e)
      if (code.code == 12000) {
        // console.log(code);
        // console.log(code.object);
        // console.log(code.object.List[0]);
        for (const iterator of code.object.List) {
          Global.loadPre('boxs', nodeList => {
            let com = nodeList.getComponentsInChildren(cc.Label)
            com[0].string = iterator.Money
            com[1].string = iterator.StateCode
            com[2].string = iterator.Subtime
            if (num == 1) {
              this.ByGolds.content.addChild(nodeList)
            }
            if (num == 2) {
              this.BsGolds.content.addChild(nodeList)
            }
          })
        }
      }
    })

  },
  //%.27获取用户中心
  GetUserCenter() {
    var xhr = cc.loader.getXMLHttpRequest()
    let data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/account/GetUserCenter", data, e => {
      let code = JSON.parse(e)
      if (code.code == 12000) {
        // console.log(code.object);
        this.QsNumber.string = '极速答题周对局：' + code.object.ExamNumber
        this.ThunderNumber.string = '排雷先锋周对局：' + code.object.ThunderNumber
        this.PigNumber.string = '集小猪佩奇总数量：' + code.object.LittlePigPekyNumber
        this.QsWinNumber.string = code.object.ExamWinningRate + '%'
        this.ThWinNumber.string = code.object.ThunderWinningRate + '%'
        this.UserInfoName.string = code.object.UserName;
        this.MyName.string = code.object.UserName;
        this.MyId.string = 'ID:' + code.object.Login;
        this.UserInfoId.string = 'ID:' + code.object.Login;
      }
      if (code.code == 12002) {
        cc.director.loadScene('LoginPage')
      }
    })
  },
  GetThunderTrades() {
    this.ThunderScroll.content.removeAllChildren()
    let data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,
      PageIndex: 1,
      PageSize: 10,
    }
    Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/caileigame/GetThunderTrades", data, e => {
      let code = JSON.parse(e)
      if (code.code == 12000) {
        // console.log(code);
        if (code.object.total != 0) {
          for (const iterator of code.object.List) {
            Global.loadPre('boxs', nodeList => {
              // console.log(nodeList.getComponentsInChildren(cc.Label))
              let com = nodeList.getComponentsInChildren(cc.Label)
              com[0].string = iterator.PlusAmount > 0 ? '胜利' : '失败'
              com[1].string = iterator.PlusAmount
              com[2].string = iterator.ExitTime
              this.ThunderScroll.content.addChild(nodeList)

              // this.QuestionScroll.content.addChild(nodeList)
            })
          }
        }
      }
    })
  },
  getexamgamerecords() {
    this.QuestionScroll.content.removeAllChildren()
    let data = {
      Userid: Global.DataUsers.UserId,
      Token: Global.DataUsers.Token,
      PageIndex: 1,
      PageSize: 10,
    }
    Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/exam/getexamgamerecords", data, e => {
      let code = JSON.parse(e)
      if (code.code == 12000) {
        // console.log(code);
        if (code.object != '') {
          for (const iterator of code.object) {
            Global.loadPre('boxs', nodeList => {
              let com = nodeList.getComponentsInChildren(cc.Label)
              com[0].string = (iterator.RecyclingAmount - iterator.TradesAmount) > 0 ? '胜利' : '失败'
              com[1].string = iterator.Profit
              com[2].string = this.formatDateTime(iterator.ExitTime)
              this.QuestionScroll.content.addChild(nodeList)
              // console.log(this.formatDateTime(iterator.ExitTime));

            })
          }
        }
      }
    })
  },
  formatDateTime(timeStamp) {
    var date = new Date();
    date.setTime(timeStamp * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  }
});
// 