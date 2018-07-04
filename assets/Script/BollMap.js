import { GetUserDatas } from 'GetUserData'
cc.Class({
    extends: cc.Component,
    properties: {
        B1: cc.Prefab,
        B2: cc.Prefab,
        B3: cc.Prefab,
        C1: cc.Prefab,
        S1: cc.Prefab,
        BoxArray: [],
        Track_map1: cc.Node,
        Track_map2: cc.Node,
        resetX: -1000,
        GameOver: false, //开始是TRUE 
        point: cc.Label,
        totalTime: cc.Label,
        StartBox: cc.Node,
        StartGameLose: cc.Node,
        _bollTime: null,
        sum: -1
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        GetUserDatas()
        Global._bollPointString = this.point
        // console.log(cc.random0To1());
        Global._bollGameOver = this.GameOver

        //对象池
        this.addPoolList()

    },
    start() {
        // 初始化所有数据
        Global._bollPoint = 0
        Global._bollSpeeds = 0
        Global._bollTime = 0

    },
    addPoolList() {
        this.towerPool = new cc.NodePool('PoolHandler');
        this.towerPoolBox = new cc.NodePool('PoolHandler');
        this.monster = new cc.NodePool('PoolHandler');
        this.point = new cc.NodePool('PoolHandler');
        this.speedSlice = new cc.NodePool('PoolHandler');

        let initCount = 100;
        let enemy = null, enemy2 = null, enemy3 = null, point = null, speedSlice = null

        for (let i = 0; i < initCount; ++i) {
            enemy = cc.instantiate(this.B1); // 创建节点
            enemy2 = cc.instantiate(this.B2); // 创建节点
            enemy3 = cc.instantiate(this.B3); // 创建节点
            point = cc.instantiate(this.C1); // 创建节点
            speedSlice = cc.instantiate(this.S1); // 创建节点

            this.towerPool.put(enemy); // 通过 putInPool 接口放入对象池
            this.towerPoolBox.put(enemy2); // 通过 putInPool 接口放入对象池
            this.monster.put(enemy3); // 通过 putInPool 接口放入对象池
            this.point.put(point)
            this.speedSlice.put(speedSlice)
        }

    },

    //生成的对象池
    addPool(MType) {
        let rand = cc.random0To1()
        switch (MType) {
            case 0:
                if (rand > 0.7) {
                    return this.getPool(this.towerPool, this.B1)
                }
                if (rand > 0.3 && rand < 0.7) {
                    return this.getPool(this.towerPoolBox, this.B2)
                }
                if (rand < 0.3) {
                    return this.getPool(this.monster, this.B3)
                }
            case 1:
                return this.getPool(this.point, this.C1)

            case 2:
                return this.getPool(this.speedSlice, this.S1)

            default:
                break;
        }
    },
    getPool(Pool, b) {
        let enemy = null;
        if (Pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            enemy = Pool.get(); //获取节点后，就会调用 MenuItem 里的 reuse 方法，完成点击事件的注册。当使用 menuItemPool.put(menuItemNode) 回收节点后，会调用 MenuItem 里的 unuse 方法，完成点击事件的反注册。
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            console.log('对象池没对象了');
            enemy = cc.instantiate(b);
        }
        return enemy
    },
    //this.createEnemy(Track_map,)
    createEnemy(Track_map, rx, ry, MType) {
        let enemy = this.addPool(MType)
        // enemy.height = cc.random0To1() * (500 - 200) + 200
        // enemy.width = cc.random0To1() * (180 - 80) + 80
        let _w = (Track_map.height / 4) //136
        let _w1 = _w / 2   //68
        let _h = (Track_map.width / 50)    //133.4     66.7
        let _ry = ry % 50
        if (rx > 1) { enemy.y = parseInt(_w * rx - _w1) }
        if (rx < 2) { enemy.y = parseInt(_w1) }
        enemy.x = parseInt(_h * _ry);
        // console.log(rx + '-' + ry);
        // console.log('X:' + enemy.x + 'Y:' + enemy.y);
        Track_map.addChild(enemy);

        // let _enemy = cc.moveBy(Boll.FloorSpeeds, cc.p(-this.Track_map.width / 2, -250));
        // let _opacity = cc.fadeIn(1.0);
        // let _scaleTo = cc.scaleTo(1, 1, 1.5)
        // let _callFunc = cc.callFunc(this.removeNode, this, enemy)
        // let _spawn = cc.spawn(_opacity, _enemy, _scaleTo)
        // let _sequence = cc.sequence(_spawn, _callFunc)
        // enemy.runAction(_sequence)
        // console.log(enemy);

    },

    removeNode(Pool, enemy) {
        Pool.put(enemy); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    },
    GameTimes() {
        console.log('计时开始');
        this.T2 = () => {
            if (Global._bollGameOver == false) {
                this.unschedule(this.T2);
            } else {
                let x = Global._bollTime++;
                this.totalTime.string = '坚持时间:' + x + 's'
                Global._bollSpeeds = Global._bollSpeeds - x
            }
        };
        this.schedule(this.T2, 1);
    },
    StartBarrier() {
        this.sum = 0
        var _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/BallSprint/Start", _data, e => {
            let _Object = JSON.parse(e)
            if (_Object.code = 12000) {
                let s = 6
                for (const iterator of _Object.object) {
                    // iterator.MType
                    // iterator.Num
                    // iterator.X
                    // iterator.Y
                    this.createEnemy(this.Track_map1, iterator.X, iterator.Y, iterator.MType)
                    Global._bollSpeeds = Global._bollSpeed
                    // this.schedule(this.GameTimes, 1);

                    s--
                    // if (s < 1) {
                    //     break;
                    // }
                }
                this.GameTimes()
                this.CreatorBarrier(this.Track_map2)
            }
            Global._bollGameOver = true

        })
    },
    CreatorBarrier(map) {
        var _data = {
            Userid: Global.DataUsers.UserId,
            Token: Global.DataUsers.Token,
        }
        Global.streamXHREventsToLabel(cc.loader.getXMLHttpRequest(), "POST", Global.serverUrl + "/BallSprint/GetRunway", _data, e => {
            let _Object = JSON.parse(e)
            if (_Object.code = 12000) {
                for (const iterator of _Object.object) {
                    this.createEnemy(map, iterator.X, iterator.Y, iterator.MType)
                }
            }
        })
    },

    addSpeeds() {
        Global._bollSpeeds = Global._bollSpeeds - 100
        console.log(Global._bollSpeeds);
    },
    removeSpeeds() {
        Global._bollSpeeds = Global._bollSpeeds + 100
        console.log(Global._bollSpeeds);
    },
    update(dt) {
        var t1 = this.Track_map1, t2 = this.Track_map2, x1 = this.Track_map1.x, x2 = this.Track_map2.x
        if (Global._bollGameOver) {
            x1 += Global._bollSpeeds * dt;
            x2 += Global._bollSpeeds * dt;
            Global._boll_Map_x1 = x1
            Global._boll_Map_x2 = x2
            console.log('x1:' + x1);
            console.log('x2:' + x2);
        }
        if (x1 <= -t1.width + -666) {
            console.log('------1------');
            this.loadMap(t1)
            Global._bollMM++
            t1.removeAllChildren()
            console.log('清空第一列' + t1.x);
            t1.x = t1.width - 667;
            if (Global._bollGameOver) {
                this.CreatorBarrier(t1)
                console.log('拉去下一面数据' + t1.x);
            }
        } else {
            t1.x = x1;
        }
        if (x2 <= -t2.width + -666) {
            console.log('-------2-----');
            this.loadMap(t2)
            t2.removeAllChildren()
            console.log('清空第二列');
            Global._bollMM++
            if (Global._bollGameOver) {

                this.CreatorBarrier(t2)
                console.log('拉去下一面数据');
            }
            t2.x = t1.width - 667;
        } else {
            t2.x = x2;
        }
        // }

    },
    loadMap(tNode) {
        for (const iterator of tNode.children) {
            if (iterator.name == 'track_b1') {
                this.removeNode(this.towerPool, iterator)
                console.log('-1-' + this.towerPool.size());
            }
            if (iterator.name == 'track_b2') {
                this.removeNode(this.towerPoolBox, iterator)
                console.log('-4-' + this.towerPoolBox.size());
            }
            if (iterator.name == 'track_b3') {
                this.removeNode(this.monster, iterator)
                console.log('-5-' + this.monster.size());
            }
            if (iterator.name == 'track_c1') {
                this.removeNode(this.point, iterator)
                console.log('-2-' + this.point.size());
            }
            if (iterator.name == 'track_s1') {
                this.removeNode(this.speedSlice, iterator)
                console.log('-3-' + this.speedSlice.size());
            }
        }
    },

    NextGame(e, n) {
        if (n == 1) {  //再来一次
            this.StartGameLose.scale = 0
        }
        if (n == 2) { //回去首页
            this.StartGameLose.scale = 0
            this.StartBox.scale = 1
        }
        Global._bollPointString.string = 0
        Global._bollPoint = 0
        this.totalTime.string = '坚持时间:0s'
        this.Track_map1.x = -667
        this.Track_map2.x = this.Track_map2.width - 667
        console.log(this.Track_map1.x);
        console.log(this.Track_map2.x);
        this.Track_map1.removeAllChildren()
        this.Track_map2.removeAllChildren()
        Global._bollSpeeds = Global._bollSpeed
        Global._bollTime = 0

    },

});

