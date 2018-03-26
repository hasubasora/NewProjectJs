// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    //声明属性用、
    properties: {
        userID: 20,
        userName: "Foobar",
        //当声明的属性为基本 JavaScript 类型时，可以直接赋予默认值：
        height: 20, // number
        type: "actor", // string
        loaded: false, // boolean                
        target: null, // object
        //当声明的属性具备类型时（如：cc.Node，cc.Vec2 等），可以在声明处填写他们的构造函数来完成
        target: cc.Node,
        pos: cc.Vec2,
        //当声明属性的类型继承自 cc.ValueType 时（如：cc.Vec2，cc.Color 或 cc.Rect），除了上面的构造函数，还可以直接使用实例作为默认值：
        pos: new cc.Vec2(10, 20),
        color: new cc.Color(255, 255, 255, 128),
        //当声明属性是一个数组时，可以在声明处填写他们的类型或构造函数来完成声明
        any: [], // 不定义具体类型的数组
        bools: [cc.Boolean],
        strings: [cc.String],
        floats: [cc.Float],
        ints: [cc.Integer],

        values: [cc.Vec2],
        nodes: [cc.Node],
        frames: [cc.SpriteFrame],
        //除了以上几种情况，其他类型我们都需要使用完整声明的方式来进行书写。

        //有些情况下，我们需要为属性声明添加参数，这些参数控制了属性在 属性检查器 中的显示方式，以及属性在场景序列化过程中的行为
        score: {
            default: 0,
            displayName: "Score (player)",
            tooltip: "The score of player",
        },
        //在属性中设置了 get 或 set 以后，访问属性的时候，就能触发预定义的 get 或 set 方法。定义方法如下：
        width: {
            get: function() {
                return this._width;
            },
            set: function(value) {
                this._width = value;
            }
        }
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},|
    //获得组件所在的节点
    start() {
        // var node = this.node;
        // node.x = 100;

        var label = this.getComponent(cc.Label);
        var text = this.String + '111';

        // Change the text in Label Component
        label.string = text;
    },

    // update (dt) {},
});