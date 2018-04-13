
import { GetUserDatas, AddWindow } from "GetUserData";
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
    xplayer: 14,
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
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    var ws = new WebSocket("ws://192.168.1.168:2000");
    ws.onopen = function (event) {
      console.log("Send Text WS was opened. 打开OPEN");
    };
    ws.onmessage = function (event) {
      console.log("response text msg数据: " + event.data);
      console.log('sdsds');
    };
    ws.onerror = function (event) {
      console.log("Send Text fired an error错误");
    };
    ws.onclose = function (event) {
      console.log("WebSocket instance closed.");
    };

    setTimeout(function () {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send("Hello WebSocket, I'm a text message！这.");
      }
      else {
        console.log("WebSocket instance wasn't ready...！");
      }
    }, 3);

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

    this.schedule(function() {
      // 这里的 this 指向 component
      this.Gotop.interactable = true;
    }, 3);
    this.TimeOuts();

  },

  /**
   * 设置按钮
   */
  SetingBox() {
    AddWindow(this.node.parent, this.Setings)
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
  //前进
  ClickGoTop() {
    if (this.xplayer > 3) {
      this.moveToPlayer(8, this.xplayer);
      this.Gotop.interactable = false;
    }
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
  radioButtonClicked: function(toggle) {
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
  }
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
