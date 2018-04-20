import { GetUserDatas, AddWindow, GoLoadScene, LoginTimeOut } from "GetUserData";
// var netControl = require('NetControl');

cc.Class({
  extends: cc.Component,

  properties: {
    Maps: {
      default: null,
      type: cc.TiledMap
    },
    Player: {
      default: null,
      type: cc.TiledLayer
    },
    // 上楼按钮
    GotoUp: {
      default: null,
      type: cc.Button
    },
    StopUp: {
      default: null,
      type: cc.Button
    },
    TimesOut: {
      default: null,
      type: cc.Label
    },

    radioButton: {
      default: [],
      type: cc.Toggle
    },

    Audios: cc.AudioSource,
    Setings: {
      default: null,
      type: cc.Prefab
    },
    //金币
    Gold: cc.Label,         //金币总数
    upGold: cc.Label,       //前进所需要的金币
    allGold: cc.Label,      //金币池
    //用户名字设置
    User_Name: cc.Label,
    User_Id: cc.Label,
    //当前楼层    
    xplayer: 15,             //楼层数
    xUserNum: 0,             //设置人物位置
    IsStop: 0,               //停止的楼层
    xFloor: 1,               //记录当前玩家移动楼层
    T1: '',
    T2: '',
    T3: '',
    T4: '',
    floorNext: cc.Label,      //下一层收益
    floorForme: cc.Label,     //当前收益
    ServerTimes: 0,           //记录服务器时间
    GetServerTimesSave: 0,    //记录服务器的请求间隔时间
    sThirty: 30,              //倒计时用的参数
    sTimes: 0,                //开始时间
    eTimes: 0,                //结束时间
    eTneTime: 10,             //十秒的倒计时
    eThreeTime: 3,            //三秒
    tName: cc.Label,          //倒计时的文字
    n1: 0,                    //爆炸上一楼有多少人
    n2: 0,                    //爆炸此楼有多少人
    bom: 0                    //保存炸弹的楼层

  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {

    console.log('进入游戏界面')
    this.GetBaseRoom()
    this.SetInfo()          //设置用户数据
    this.GetServerTimes()   //获取服务器时间接口
    this.SetServerTimes()   //服务器时间自动计时
    //判断有没有账户


    //音乐初始化
    Global.Audios = this.Audios;
    Global.Audios.volume = cc.sys.localStorage.getItem("Mic");
    //将像素坐标转化为瓦片坐标，posInPixel：目标节点的position
    let pos = this.Player.getPositionAt(0, 0);
    let pos1 = this.Player.getPositionAt(3, 14); //Vec2 {x: 50, y: 400}
    let pos2 = this.Player.getPositionAt(3, 13); //Vec2 {x: 100, y: 425}
    let pos3 = this.Player.getPositionAt(3, 12); //Vec2 {x: 150, y: 450}

    // this.Player.setTileGID(pos1, 3, 14, gid);
    // console.log(this.Player.setTexture()) //setTexture 设置纹理。
    //选择人物前面+1 移动后面-1

    //获取GID 没有就是0 用来判断地雷

    // this.schedule(function () {
    //   // 这里的 this 指向 component
    //   this.GotoUp.interactable = true;
    // }, 3);





  },
  start() {
    this.Prepare()          //获取房间数据
    // this.StartGames()
    this.nSocket()
  },
  //获取规则
  GetBaseRoom() {
    let _data = {
      token: Global.DataUsers.sToken,
      userid: Global.DataUsers.sUserId,
      roomnumberid: Global._StageData.Data
    }
    Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/caileigame/getbaseroom", _data, e => {
      let _e = JSON.parse(e);
      cc.sys.localStorage.setItem('_Golds', JSON.stringify(_e.object.rule.List));
      console.log(_e.object.rule.List)
      this.CalculateGold()
    })
  },

  loaderViewWin(gold) {
    console.log(gold)
    cc.loader.loadRes("/prefab/Win", function (err, Win) {
      if (err) {
        console.log(err)
        return;
      }
      var newNode = cc.instantiate(Win);
      cc.director.getScene().addChild(newNode);
      let _newNode = cc.find("sl/winText", newNode)
      _newNode.getComponentsInChildren(cc.Label)[0].string = gold;
    });
  },

  loaderViewWinLost() {
    cc.loader.loadRes("/prefab/lose", function (err, lost) {
      if (err) {
        console.log(err)
        return;
      }
      var newNode = cc.instantiate(lost);
      cc.director.getScene().addChild(newNode);
      let _newNode = cc.find("sl/winText", newNode)
      _newNode.getComponentsInChildren(cc.Label)[0].string = '输了就点确定';

    });
  },
  loaderViewText(gold) {
    cc.loader.loadRes("/prefab/iView", function (err, iView) {
      if (err) {
        console.log(err)
        return;
      }
      var newNode = cc.instantiate(iView);
      cc.director.getScene().addChild(newNode);
      // let _newNode = cc.find("sl/winText", newNode)
      // _newNode.getComponentsInChildren(cc.Label)[0].string = gold;
    });
  },

  // 获取准备房间信息 等待开始 60  
  Prepare() {
    let xhr = cc.loader.getXMLHttpRequest()
    let _data = {
      Userid: Global.DataUsers.sUserId,
      Token: Global.DataUsers.sToken,
      roomnumberid: Global._StageData.Data
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/caileigame/getroom", _data, e => {
      console.log('已获取房间数据')
      let _StageData = JSON.parse(e);
      if (_StageData.code == 12000) {
        cc.sys.localStorage.setItem('_StageData', e);
        // console.log(cc.sys.localStorage.getItem("_StageData"))
        let D = _StageData.object
        this.eTimes = D.EndTimestamps;
        this.sTimes = D.CurrentTimestamps
        // console.log(this.sThirty)
        // console.log('设置结束时间：' + D.EndTimestamps)
        // console.log('设置开始时间：' + D.CurrentTimestamps)
        console.log(D.CountdownType)
        //当前游戏状态 1:等待开始,2:前进,3:开雷
        if (D.CountdownType == 1) {
          this.tName.string = '等待玩家..'
          this.sThirty = D.EndTimestamps - D.CurrentTimestamps
          this.unschedule(this.T1);
          this.StartTimeOuts()
        }
        if (D.CountdownType == 2) {
          this.tName.string = '扫雷开始'
          this.eTneTime = D.EndTimestamps - D.CurrentTimestamps
          // this.eTneTime = 10
          this.unschedule(this.T2);
          this.GameTimeOuts()
        }
        if (D.CountdownType == 3) {
          this.tName.string = '排雷中...'
          this.eThreeTime = D.EndTimestamps - D.CurrentTimestamps
          // this.eThreeTime = 3
          this.unschedule(this.T2); //爆炸的时候清除第二个定时器
          this.unschedule(this.T3);
          this.BomTimeOuts()
        }
        console.log('参的咸鱼')
        console.log(D.RoomUser)
        Global.RoomUserLen = D.RoomUser.length
        Global.GameRoomData = D.RoomUser;
        this.CalculateAllGold()
        this.SetGameRoomData()
      } else {
        console.log('GetRoom 错误，在房间躺枪了')
      }
    })
  },
  // 设置房间数据
  SetGameRoomData() {
    Global.GameRoomData.forEach((v, i) => {
      if (v.UserId == Global.DataUsers.sUserId) {
        //设置人物位置数据
        this.xUserNum = i + 2;
        this.xplayer = (15 - v.CurrentFloor)
        console.log('楼层赋值')
      }

    })
  },

  //上一楼
  GoToUpFn(types) {
    console.log(types)
    let _data = {
      Userid: Global.DataUsers.sUserId,
      Token: Global.DataUsers.sToken,
      Roomnumberid: Global._StageData.Data,
      Type: types
    }
    Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/caileigame/gameaction", _data, e => {
      let _StageData = JSON.parse(e);
      console.log(_StageData)
      if (_StageData.code == 12000) {
        this.IsStop = _StageData.type
      } else {
        console.log(_StageData.message)
        console.log('在房间躺枪了上一层')
      }
    })
  },
  //前进
  ClickGotoUp(e, n) {
    console.log("前进");
    if (this.xplayer > 2) {
      this.GoToUpFn(n)
      this.xFloor++
      this.moveToPlayer(this.xUserNum, this.xplayer);
      this.ButtonType(2)
      this.CalculateAllGold()
      this.CalculateGold()
    }
  },
  //不走
  StopPlayer(e, n) {
    console.log("不走了");
    this.GoToUpFn(n)
    //前进按钮设置false
    this.ButtonType(2)
  },
  //移动人物用
  moveToPlayer(n, x) {
    //获取玩家
    let players = this.Player.getTileAt(n, x);
    //获取玩家GID
    let gid = this.Player.getTileGIDAt(n, x);
    // 设置玩家运动
    let moveTo = cc.moveBy(1, cc.p(50, 25)); //x=50 y=25 z=50
    //回调切换位置
    let finish = cc.callFunc(() => {
      //删除原坐标
      this.Player.removeTileAt(n, x);
      let F = x - 1;
      //设置新坐标   
      this.Player.setTileGID(gid, n, F, gid);
      // this.xplayer = F;
    }, players);
    //顺序执行
    let mAcion = cc.sequence(moveTo, finish);
    // 启动运动
    players.runAction(mAcion);
    //运动结束后重新设置GID
  },

  //服务器计时器
  SetServerTimes() {
    this.schedule(function () {
      // 这里的 this 指向 component
      if (this.GetServerTimesSave == 10) {
        this.GetServerTimes()
        this.GetServerTimesSave = 0
        return;
      }
      this.GetServerTimesSave++;
      this.ServerTimes++;
      // console.log('我是计时器')
      // console.log(this.GetServerTimesSave)
      // console.log(this.ServerTimes)
    }, 1);
  },
  //获取服务器时间接口
  GetServerTimes() {
    let _data = {
      Userid: Global.DataUsers.sUserId,
      Token: Global.DataUsers.sToken,
      roomnumberid: Global._StageData.Data
    }
    Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/caileigame/getheartbeat", _data, e => {
      let obj = JSON.parse(e)
      this.ServerTimes = obj.CurrentTime
      // console.log('获取服务器时间：' + obj.CurrentTime)

      // console.log(new Date(b.CountdownEndTime).getTime() - new Date(b.CurrentTime).getTime())
    })
  },

  StartTimeOuts() {
    this.T1 = function () {
      if (this.sThirty < 1) {
        this.unschedule(this.T1);
        //启动十秒倒计时
      } else {
        let x = this.sThirty - 1;
        this.TimesOut.string = x;
        this.sThirty = x;
      }
    };
    this.schedule(this.T1, 1);
    // 上面的计时器将在10秒后开始计时，每5秒执行一次回调，重复3次。
  },
  GameTimeOuts() {
    this.T2 = function () {
      if (this.eTneTime < 1) {
        // this.GetServerTimes()
        this.unschedule(this.T2);
      } else {
        // this.unschedule(this.T2);
        let x = this.eTneTime - 1;
        this.TimesOut.string = x;
        this.eTneTime = x;
      }
    };
    this.schedule(this.T2, 1);
  },
  BomTimeOuts() {
    this.T3 = function () {
      if (this.eThreeTime < 1) {
        // this.GetServerTimes()
        this.unschedule(this.T3);
      } else {
        // this.unschedule(this.T3);
        let x = this.eThreeTime - 1;
        this.TimesOut.string = x;
        this.eThreeTime = x;
      }
    };
    this.schedule(this.T3, 1);
  },
  nSocketTime() {
    this.T4 = () => {
      this.nSocket()
    };
    this.schedule(this.T4, 5);
  },
  CalculateAllGold() {
    var s = 0;
    Global.GameRoomData.forEach((v, i) => {
      s += v.Amount
      console.log('计算')
    })
    this.allGold.string = s
  },
  //金币计算
  CalculateGold() {
    Global._Golds = JSON.parse(cc.sys.localStorage.getItem('_Golds'))
    for (const iterator of Global._Golds) {
      if (iterator.Floor == (this.xFloor + 1)) {
        this.upGold.string = iterator.Chip
      }
      if (iterator.Floor == this.xFloor) {
        this.Gold.string = this.Gold.string - iterator.Chip
        this.floorForme.string = (this.allGold.string / Global.RoomUser);
        this.floorNext.string = '我是预计的'
      }
    }

    // for (let i = 11; i > 1; i--) {
    //   let gid = this.Player.getTileGIDAt(i, numb);
    //   // console.log('坐标' + i + 'GID:' + gid)
    //   if (gid != 0) {
    //     this.floorForme.string = gold;
    //     this.floorNext.string = 120;
    //   }
    //   // console.log(Json[0].Floor)
    //   // console.log(Json[0].Chip)

    // }

  },

  // 退出房间
  OutRoom() {
    let _data = {
      Userid: Global.DataUsers.sUserId,
      Token: Global.DataUsers.sToken,
      roomnumberid: Global._StageData.Data
    }
    Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/caileigame/outroom", _data, e => {
      let _StageData = JSON.parse(e);
      GoLoadScene("Home")

      if (_StageData.Success) {
        console.log(_StageData.Message)
      } else {
        console.log(_StageData.Message)
      }
    })
  },

  /**
   * 切换金币的
   */
  radioButtonClicked: function (toggle) {
    var index = this.radioButton.indexOf(toggle);
    alert(index);
    var title = "RadioButton";
    switch (index) {
      case 0:
        title += "1";
        break;
      case 1:
        title += "2";
        break;
      case 2:
        title += "3";
        break;
      default:
        break;
    }
  },
  /**
 * 设置按钮
 */
  SetingBox() {
    AddWindow(this.node.parent, this.Setings);
  },
  // 账户数据设置
  SetInfo() {
    Global.getDataUsers()
    this.User_Name.string = Global.DataUsers.sNickName;
    this.User_Id.string = 'ID:' + Global.DataUsers.sLogin;
    this.Gold.string = Global.DataUsers.sBalance;
  },
  nSocket(_fnRun) {
    var ws = new WebSocket(Global.DataUsers.wsUrl);
    ws.onopen = (event) => {
      this.unschedule(this.T4);
      console.log("サーバー　オペ");
      if (ws.readyState === WebSocket.OPEN) {
        var room = {
          Code: 101,
          Data: {
            roomId: Global._StageData.Data,
            userId: Global.DataUsers.sUserId,
            token: Global.DataUsers.sToken,
          }
        };

        ws.send(JSON.stringify(room));
        console.log("WebSocket 卫星发射...！" + JSON.stringify(room));
      } else {
        console.log("WebSocket 准备好卫星发射...！");
      }
    };
    ws.onmessage = (event) => {
      console.log("サーバーのメッセージ: " + event.data);
      let aData = JSON.parse(event.data).Data.Status
      let UserID = JSON.parse(event.data).Data.UserID
      let Floor = JSON.parse(event.data).Data.Floor
      this.GetStatus(aData, UserID, Floor)
    };
    ws.onerror = (event) => {
      console.log("メッセージ エッロ！！");
      // this.schedule(function () {
      //   // 这里的 this 指向 component
      //   this.doSomething();
      // }, 1, 99, 0);
    };
    ws.onclose = (event) => {
      console.log("サーバー　オフ.");
      this.nSocketTime()
    };

  },

  GetStatus(x, u, f) { //sk里面的id
    switch (x) {
      case 0:
        console.log('什么宝物都没有')
        break;
      case 1:
        console.log('有人参战')
        break;
      case 2:
        console.log('有人观战')
        break;
      case 3:
        console.log('准备战斗')
        break;
      case 4:
        console.log('取消准备')
        break;
      case 5:
        console.log('开始游戏')
        this.Prepare()
        this.CalculateGold()
        this.ButtonType(1)
        break;
      case 6:
        console.log('上一层楼')
        this.Prepare()
        Global.GameRoomData.forEach((v, i) => {
          console.log('移动其他玩家的棋子')
          if (v.UserId == u && v.UserId != Global.DataUsers.sUserId) {
            //设置人物位置数据
            this.moveToPlayer((i + 2), (15 - v.CurrentFloor));
            this.CalculateGold()
          }
        })
        break;
      case 7:
        console.log('停住')
        break;
      case 8:
        console.log('退出游戏')
        break;
      case 9:
        this.ButtonType(2)
        console.log('游戏结束')
        this.Prepare()
        this.Bomfn(x, f)
        break;
      case 10:
        console.log('解散房间')
        break;
      case 11:
        this.ButtonType(2)
        this.Prepare()  //获取爆炸倒计时
        console.log('要爆炸了')
        break;
      case 12:
        console.log('爆炸了')
        this.bom = f
        break;
      case 13:
        console.log('没死人')
        this.ButtonType(1)
        this.Prepare()
        break;
      case 14:
        console.log('开始失败重新倒计时')
        this.Prepare()
        break;
      case 15:
        console.log('未准备的更改为观战')
        break;
      default:
        break;
    }
  },
  //1 释放按钮  2 禁止按钮 && this.IsStop != 1
  ButtonType(a) {
    if (a == 1 && this.IsStop != 1) {
      this.GotoUp.interactable = true;
      this.StopUp.interactable = true;
    }
    if (a == 2) {
      this.GotoUp.interactable = false;
      this.StopUp.interactable = false;
    }
  },
  Bomfn(x, f) {
    let dot = false;
    let _f
    /***
     * 爆炸的输赢逻辑
     */
    if (this.bom != 0) {
      Global.GameRoomData.forEach((v, i) => {
        _f = this.bom - 1;
        v.CurrentFloor == _f ? this.n1++ : ''
        v.CurrentFloor == this.bom ? this.n2++ : ''
        i < 1 ? dot = true : ''
      })
      if (dot && this.xFloor == this.bom) {
        //咸鱼在当前的爆炸层
        console.log(this.xFloor)
        //如果上一层没有人就赢了  否则 输了
        if (this.n1 != 0) { //后面有人就输了
          console.log('你输了')
          this.loaderViewWinLost()
          return;
        } else {
          this.loaderViewWin('111')
          console.log('你赢了')
          return;
        }
      }
      if (dot && this.xFloor == _f) {
        if (this.n2 > 0) { //你前面有人
          this.loaderViewWin()
          console.log('就赢了2')
          return;
        }
      }
    }
    /***
     * 没爆炸的逻辑
     */
    if (this.bom == 0 && x == 9) {

      if (this.xFloor == f) {
        this.loaderViewWin('222')
        console.log('你赢了')
      } else {
        console.log('你输了')
        this.loaderViewWinLost()
      }
    }
  },
  update(dt) {

  },
});
// console.log(this.Maps.getMapSize()) //getMapSize 设置地图大小。
// console.log(this.Maps.setMapSize()) //setMapSize 设置地图大小。
// console.log(this.Maps.getTileSize()) //getTileSize 获取地图背景中 tile 元素的大小。
// console.log(this.Maps.setTileSize()) //setTileSize 设置地图背景中 tile 元素的大小。
// console.log(this.Maps.getMapOrientation()) //getMapOrientation 获取地图方向。
// console.log(this.Maps.setMapOrientation()) //setMapOrientation 设置地图方向。
// console.log(this.Maps.getObjectGroups()) //getObjectGroups 获取所有的对象层。
// console.log(this.Maps.getProperties()) //getProperties 获取地图的属性。
// console.log(this.Maps.setProperties()) //setProperties 设置地图的属性。
// console.log(this.Maps.allLayers()) //allLayers 返回包含所有 layer 的数组。
// console.log(this.Maps.getLayer("roles")) //getLayer 获取指定名称的 layer。
// console.log(this.Maps.getObjectGroup("roles")); //getObjectGroup 获取指定的 TMXObjectGroup。
// console.log(this.Maps.getProperty()) //getProperty 通过属性名称，获取指定的属性。
// console.log(this.Maps.getPropertiesForGID()) //getPropertiesForGID 通过 GID ，获取指定的属性。
// console.log(this.Maps.update()) //update 如果该组件启用，则每帧调用 update。
// console.log(this.Maps.lateUpdate()) //lateUpdate 如果该组件启用，则每帧调用 LateUpdate。

// console.log(this.Player.getLayerName()) //getLayerName 获取层的名称。
// console.log(this.Player.SetLayerName()) //getLayerName 获取层的名称。
// console.log(this.Player.getProperty()) //getProperty 获取指定属性名的值。
// console.log(this.Player.getPositionAt(0,0)) //getPositionAt 获取指定 tile 的像素坐标。
// console.log(this.Player.removeTileAt()) //removeTileAt 删除指定坐标上的 tile。
// console.log(this.Player.setTileGID()) //setTileGID 设置给定坐标的 tile 的 gid (gid = tile 全局 id)， tile 的 GID 可以使用方法 “tileGIDAt” 来获得。如果一个 tile 已经放在那个位置，那么它将被删除。
// console.log(this.Player.getTileGIDAt(2,14)) //getTileGIDAt 通过给定的 tile 坐标、flags（可选）返回 tile 的 GID. 如果它返回 0，则表示该 tile 为空。该方法要求 tile 地图之前没有被释放过(如：没有调用过layer.releaseMap()).
// console.log(this.Player.getTileAt()) //getTileAt 通过指定的 tile 坐标获取对应的 tile(Sprite)。 返回的 tile(Sprite) 应是已经添加到 TMXLayer，请不要重复添加。 这个 tile(Sprite) 如同其他的 Sprite 一样，可以旋转、缩放、翻转、透明化、设置颜色等。 你可以通过调用以下方法来对它进行删除:layer.removeChild(sprite, cleanup); 或 layer.removeTileAt(cc.v2(x,y));
// console.log(this.Player.releaseMap()) //releaseMap 从内存中释放包含 tile 位置信息的地图。除了在运行时想要知道 tiles 的位置信息外，你都可安全的调用此方法。如果你之后还要调用 layer.tileGIDAt(), 请不要释放地图.
// console.log(this.Player.setContentSize()) //setContentSize 设置未转换的 layer 大小。
// console.log(this.Player.getTexture()) //getTexture 获取纹理。
// console.log(this.Player.setTexture()) //setTexture 设置纹理。
// console.log(this.Player.setTileOpacity()) //setTileOpacity 设置所有 Tile 的透明度
// console.log(this.Player.getLayerSize()) //getLayerSize 获得层大小。
// console.log(this.Player.setLayerSize()) //setLayerSize 设置层大小。
// console.log(this.Player.getMapTileSize()) //getMapTileSize 获取 tile 的大小( tile 的大小可能会有所不同)。
// console.log(this.Player.setMapTileSize()) //setMapTileSize 设置 tile 的大小。
// console.log(this.Player.getTiles()) // getTiles 获取地图 tiles。
// console.log(this.Player.setTiles()) //setTiles 设置地图 tiles
// console.log(this.Player.getTileSet()) //getTileSet 获取 layer 的 Tileset 信息。
// console.log(this.Player.setTileSet()) //  setTileSet 设置 layer 的 Tileset 信息。
// console.log(this.Player.getLayerOrientation()) //getLayerOrientation 获取 Layer 方向(同地图方向)。
// console.log(this.Player.setLayerOrientation()) //setLayerOrientation 设置 Layer 方向(同地图方向)。
// console.log(this.Player.getProperties()) //getProperties 获取 layer 的属性，可以使用 Tiled 编辑器添加属性。
// console.log(this.Player.setProperties()) //setProperties 设置层属性。
