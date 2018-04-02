cc.Class({
    extends: cc.Component,

    properties: {
        Maps: {
            default: null,
            type: cc.TiledMap,
        },
        hideLayer: {
            default: null,
            type: cc.TiledLayer,
        },
        mainLayer: {
            default: null,
            type: cc.TiledLayer,
        },
        Player: {
            default: null,
            type: cc.TiledLayer,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    start() {

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
        // console.log(this.Maps.getObjectGroup()) //getObjectGroup 获取指定的 TMXObjectGroup。
        // console.log(this.Maps.getProperty()) //getProperty 通过属性名称，获取指定的属性。
        // console.log(this.Maps.getPropertiesForGID()) //getPropertiesForGID 通过 GID ，获取指定的属性。
        // console.log(this.Maps.update()) //update 如果该组件启用，则每帧调用 update。
        // console.log(this.Maps.lateUpdate()) //lateUpdate 如果该组件启用，则每帧调用 LateUpdate。

        console.log(this.Player.getLayerName()) //getLayerName 获取层的名称。
        console.log(this.Player.SetLayerName()) //getLayerName 获取层的名称。
        console.log(this.Player.getProperty()) //getLayerName 获取层的名称。
        console.log(this.Player.getPositionAt()) //getLayerName 获取层的名称。
        console.log(this.Player.removeTileAt()) //removeTileAt 删除指定坐标上的 tile。
        console.log(this.Player.setTileGID()) //setTileGID 设置给定坐标的 tile 的 gid (gid = tile 全局 id)， tile 的 GID 可以使用方法 “tileGIDAt” 来获得。如果一个 tile 已经放在那个位置，那么它将被删除。
        console.log(this.Player.getTileGIDAt()) //getTileGIDAt 通过给定的 tile 坐标、flags（可选）返回 tile 的 GID. 如果它返回 0，则表示该 tile 为空。该方法要求 tile 地图之前没有被释放过(如：没有调用过layer.releaseMap()).
        console.log(this.Player.getTileAt()) //getTileAt 通过指定的 tile 坐标获取对应的 tile(Sprite)。 返回的 tile(Sprite) 应是已经添加到 TMXLayer，请不要重复添加。 这个 tile(Sprite) 如同其他的 Sprite 一样，可以旋转、缩放、翻转、透明化、设置颜色等。 你可以通过调用以下方法来对它进行删除:layer.removeChild(sprite, cleanup); 或 layer.removeTileAt(cc.v2(x,y));
        console.log(this.Player.releaseMap()) //releaseMap 从内存中释放包含 tile 位置信息的地图。除了在运行时想要知道 tiles 的位置信息外，你都可安全的调用此方法。如果你之后还要调用 layer.tileGIDAt(), 请不要释放地图.
        console.log(this.Player.setContentSize()) //setContentSize 设置未转换的 layer 大小。
        console.log(this.Player.getTexture()) //getTexture 获取纹理。
        console.log(this.Player.setTexture()) //setTexture 设置纹理。
        console.log(this.Player.setTileOpacity()) //setTileOpacity 设置所有 Tile 的透明度
        console.log(this.Player.getLayerSize()) //getLayerSize 获得层大小。
        console.log(this.Player.setLayerSize()) //setLayerSize 设置层大小。
        console.log(this.Player.getMapTileSize()) //getMapTileSize 获取 tile 的大小( tile 的大小可能会有所不同)。
        console.log(this.Player.setMapTileSize()) //setMapTileSize 设置 tile 的大小。
        console.log(this.Player.getTiles()) // getTiles 获取地图 tiles。
        console.log(this.Player.setTiles()) //setTiles 设置地图 tiles
        console.log(this.Player.getTileSet()) //getTileSet 获取 layer 的 Tileset 信息。
        console.log(this.Player.setTileSet()) //  setTileSet 设置 layer 的 Tileset 信息。
        console.log(this.Player.getLayerOrientation()) //getLayerOrientation 获取 Layer 方向(同地图方向)。
        console.log(this.Player.setLayerOrientation()) //setLayerOrientation 设置 Layer 方向(同地图方向)。
        console.log(this.Player.getProperties()) //getProperties 获取 layer 的属性，可以使用 Tiled 编辑器添加属性。
        console.log(this.Player.setProperties()) //setProperties 设置层属性。








        var layer = this.Maps.getLayer("layerOne")
        var layer2 = this.Maps.getLayer("layerTwo")
        var layer3 = this.Maps.getLayer("layerThree")
        var pos = layer.getPositionAt(0, 0); //获取左上角瓦片坐标为（0,0）的图块的像素坐标
        //获得当前该图块的id，也就是gid（注意，这里的id是从1开始的，与TiledMap Editor中显示的不同，如果返回值为0，则为空）
        var gid = layer.getTileGIDAt(0, 0);
        // console.log(layer._sgNode.layerName)
        // console.log(layer2._sgNode.layerName)
        // console.log(layer3._sgNode.layerName)
        layer.getTileGIDAt(this.getTilePos(cc.p(100, 100)))
    },
    //将像素坐标转化为瓦片坐标，posInPixel：目标节点的position
    getTilePos: function(posInPixel) {
        var mapSize = this.node.getContentSize();
        var tileSize = this.Maps.getTileSize();
        var x = Math.floor(posInPixel.x / tileSize.width);
        var y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height);
        return cc.p(x, y);
    },

    // update (dt) {},
});