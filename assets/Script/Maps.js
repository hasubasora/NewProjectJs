import { GetUserDatas, AddWindow, GoLoadScene } from "GetUserData";
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
    Gotop: {
      default: null,
      type: cc.Button
    },
    TimesOut: {
      default: null,
      type: cc.Label
    },
    Times: 60,

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
    Gold: cc.Label,
    //用户名字设置
    User_Name: cc.Label,
    User_Id: cc.Label,
    //当前楼层    
    xplayer: 14,
    xUserNum: 0
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwww')

    Global.nSocket()

    //判断有没有账户
    GetUserDatas() ? this.SetInfo() : GoLoadScene("Home");

    console.log(Global._StageData)

    //音乐初始化
    Global.Audios = this.Audios;
    Global.Audios.volume = cc.sys.localStorage.getItem("Mic");
    //将像素坐标转化为瓦片坐标，posInPixel：目标节点的position
    console.log(this.Player);
    let pos = this.Player.getPositionAt(0, 0);
    let pos1 = this.Player.getPositionAt(3, 14); //Vec2 {x: 50, y: 400}
    let pos2 = this.Player.getPositionAt(3, 13); //Vec2 {x: 100, y: 425}
    let pos3 = this.Player.getPositionAt(3, 12); //Vec2 {x: 150, y: 450}

    //选择人物前面+1 移动后面-1

    //获取GID 没有就是0 用来判断地雷

    this.schedule(function () {
      // 这里的 this 指向 component
      this.Gotop.interactable = true;
    }, 3);
    this.TimeOuts();
  },
  start() {
    this.Prepare()
    this.StartGames()
  },
  //获取准备房间信息
  Prepare() {
    let xhr = cc.loader.getXMLHttpRequest()
    let _data = {
      Userid: Global.DataUsers.sUserId,
      Token: Global.DataUsers.sToken,
      roomnumberid: Global._StageData.Data
    }
    console.log('准备获取房间数据')
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/caileigame/getroom", _data, e => {
      console.log('已获取房间数据')
      let _StageData = JSON.parse(e);
      if (_StageData.code == 12000) {
        cc.sys.localStorage.setItem('_StageData', e);
        console.log(cc.sys.localStorage.getItem("_StageData"))
        var D = JSON.parse(_StageData.object)
        //收益排行
        console.log('收益排行')
        console.log(D.ProfitSortList)
        //参与用户
        console.log('参与用户')
        console.log(D.RoomUser)
        //围观用户
        console.log(D.Visit)
        //围观人数
        console.log(D.VisitCount)
        D.RoomUser.forEach((v, i) => {
          console.log(v)
          console.log(i)
          console.log(v.UserId == Global.DataUsers.sUserId)
          console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
          if (v.UserId == Global.DataUsers.sUserId) {
            console.log(v.UserId)
            console.log(i)
            //设置人物位置数据
            this.xUserNum = i + 2
            console.log('~~~~~~~~~~~~~~~~~' + this.xUserNum+'~~~~~~~~~~~~~~~~~~~~~~~~~~')
          }
        })


        // array.forEach(function (currentValue, index, arr), thisValue)
        for (const obj of D.RoomUser) {
          // console.log(obj.UserId == Global.DataUsers.sUserId)

          switch (obj) {
            case 0:
              console.log('1')
              break;
            case 1:
              console.log('2')
              break;
            case 2:
              console.log('3')
              break;
            default:
              break;
          }
        }


























      } else {
        console.log('GetRoom 错误，在房间躺枪了')
      }

    })
  },
  //确认开始游戏
  StartGames() {
    let xhr = cc.loader.getXMLHttpRequest()
    let _data = {
      Userid: Global.DataUsers.sUserId,
      Token: Global.DataUsers.sToken,
      Roomid: Global._StageData.Data
    }
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/caileigame/gameready", _data, e => {
      console.log('确认游戏')
      let _StageData = JSON.parse(e);
      if (_StageData.code == 12000) {
        console.log('成功准备游戏')
        this.Prepare()
      } else {
        console.log('GameReady错误，在房间躺枪了')
      }

    })
  },
  //上一楼
  GoToUp() {
    let xhr = cc.loader.getXMLHttpRequest()
    let _data = {
      Userid: Global.DataUsers.sUserId,
      Token: Global.DataUsers.sToken,
      Roomnumberid: Global._StageData.Data
    }
    console.log(_data)
    Global.streamXHREventsToLabel(xhr, "POST", Global.serverUrl + "/caileigame/gameaction", _data, e => {
      console.log('上一层')
      let _StageData = JSON.parse(e);
      if (_StageData.code == 12000) {
        console.log('成功上一层')
        this.Prepare()
        return true
      } else {
        console.log('在房间躺枪了上一层')
        return false
      }

    })
  },


  //前进
  ClickGoTop() {
    this.GoToUp()
    if (this.xplayer > 2) {
      this.moveToPlayer(this.xUserNum, this.xplayer);
      this.Gotop.interactable = false;
    }
  },
  //移动人物用
  moveToPlayer(n, x) {
    //n是第几个玩家
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
      this.xplayer = F;
    }, players);

    //顺序执行
    let mAcion = cc.sequence(moveTo, finish);
    // 启动运动
    players.runAction(mAcion);
    //运动结束后重新设置GID
  },

  //不走
  StopPlayer() {
    console.log("不走了");
    //前进按钮设置false
    this.Gotop.interactable = false;
  },
  // 倒计时
  TimeOuts() {
    // // 以秒为单位的时间间隔
    // var interval = 5;
    // // 重复次数
    // var repeat = 3;
    // // 开始延时
    // var delay = 10;
    this.schedule(() => {
      // 这里的 this 指向 component
      let x = this.Times - 1;
      this.TimesOut.string = x;
      this.Times = x;
    }, 1);

    // 上面的计时器将在10秒后开始计时，每5秒执行一次回调，重复3次。
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
  // update (dt) {},
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
