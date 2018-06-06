cc.Class({
    extends: cc.Component,

    properties: {
        audioSource: {
            type: cc.AudioSource,
            default: null
        },
        clikcMis: {
            type: cc.AudioSource,
            default: null
        },
        clickGameMis: {
            type: cc.AudioSource,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {


    },

    start() {

    },
    play: function () {
        this.audioSource.play();
    },
    pause: function () {
        this.audioSource.pause();
    },
    // update (dt) {},
   
});