

var TouchDragger = cc.Class({
    extends: cc.Component,

    properties: {
        propagate: {
            default: false,
        },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.pointAnima1 = cc.director.getScene().getChildByName('point1').getComponent(cc.Animation)
        this.pointAnima2 = cc.director.getScene().getChildByName('point2').getComponent(cc.Animation)
        this.pointAnima3 = cc.director.getScene().getChildByName('point3').getComponent(cc.Animation)
        this.pointAnima4 = cc.director.getScene().getChildByName('point4').getComponent(cc.Animation)
        console.log('---没有加载吗--');
        this.node.opacity = 160;
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            cc.log('Drag stated ...');
            this.opacity = 255;
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.opacity = 255;
            var delta = event.touch.getDelta();
            // this.x += delta.x;
            if (this.y > 240 && delta.y < 1 || this.y < -240 && delta.y > -1) {
                this.y += delta.y;
            } else {
                this.y -= delta.y;
            }
            if (this.getComponent(TouchDragger).propagate)
                event.stopPropagation();
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            this.opacity = 160;
        }, this.node);
    },
    OverGame() {
        let Curry = 0
        if (Global._boll_Map_x1 < -667) {
            Curry = Math.abs(Global._boll_Map_x1 + 667)
        }
        if (Global._boll_Map_x2 < -667) {
            Curry = Math.abs(Global._boll_Map_x2 + 667)
        }
        console.log(Curry);
        var _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
            CurrY: parseInt(Global._bollMM * 6670 + Curry),
            CurrAmount: Global._bollPointString.string,
            CurrData: 0
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/BallSprint/GameOver", _data, e => {
            let _Object = JSON.parse(e)
            console.log(_Object.code);
            console.log('游戏停止');
            Global._bollGameOver = false
            console.log(Global._bollGameOver);
        })
    },
    
    onCollisionEnter(other, self) {
        // console.log(self); //球
        console.log(other.node.name); //障碍物
        if (other.node.name == 'track_b1' || other.node.name == 'track_b2' || other.node.name == 'track_b3') {
            //スビト　stop
            console.log('stop');
            Global._bollSpeeds = 0
            Global._bollLoseBox.scale = 1
            cc.find('background/sLabel', Global._bollLoseBox).getComponent(cc.Label).string = Global._bollPointString.string
            this.OverGame()
        }

        if (other.node.name == 'track_s1') {

            //加速
            console.log('スビト');
            Global._bollSpeeds = -1000
            this.scheduleOnce(() => {
                Global._bollSpeeds = Global._bollSpeed
            }, 3);
        }
        if (other.node.name == 'track_c1') {
            // 碰撞组件的 aabb 碰撞框 金币
            var aabb = other.world.aabb.y;
            if (aabb >= 408) {
                this.pointAnima1.play()
            }
            if (aabb < 408 && aabb >= 272) {
                this.pointAnima2.play()
            }
            if (aabb < 272 && aabb > 136) {
                this.pointAnima3.play()
            }
            if (aabb <= 136) {
                this.pointAnima4.play()
            }
            Global._bollPoint++
            Global._bollPointString.string = Global._bollPoint * 10
            other.node.removeFromParent()
        }
        // 装上后操作
        console.log('on collision enter');
        // this.node.color = cc.Color.RED;
        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        var world = self.world;
        // console.log(world);

        // 上一次计算的碰撞组件的 aabb 碰撞框
        var preAabb = world.preAabb;

        // 碰撞框的世界矩阵
        var t = world.transform;

        // 以下属性为圆形碰撞组件特有属性
        var r = world.radius;
        var p = world.position;

        // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        var ps = world.points;
    },
});