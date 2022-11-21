class GameMusic {
    constructor(playground) {
        this.playground = playground;
        this.$bgm = $(`<audio class="ac-game-playground-bgm" src="" autoplay='autoplay' loop='loop'></audio>`);
        this.playground.$playground.append(this.$bgm);

        let bgm = document.getElementsByClassName("ac-game-playground-bgm")[0];


        /*if(sure_skin === 1) {
            bgm.src = "https://www.genball.cn/static/audio/playground/ayaka.mp3";
        } else if(sure_skin === 2) {
            bgm.src = "https://www.genball.cn/static/audio/playground/childe.mp3";
        } else if(sure_skin === 3) {
            bgm.src = "https://www.genball.cn/static/audio/playground/hutao.mp3";
        } else if(sure_skin === 4) {
            bgm.src = "https://www.genball.cn/static/audio/playground/kelee.mp3";
        } else if(sure_skin === 5) {
            bgm.src = "https://www.genball.cn/static/audio/playground/keqing.mp3";
        } else if(sure_skin === 6 ) {
            bgm.src = "https://www.genball.cn/static/audio/playground/raidenshogun.mp3";
        } else if(sure_skin === 7) {
            bgm.src = "https://www.genball.cn/static/audio/playground/kokomi.mp3"
        } else if(sure_skin === 8) {
            bgm.src = "https://www.genball.cn/static/audio/playground/windy.mp3";
        } else if(sure_skin === 9) {
            bgm.src = "https://www.genball.cn/static/audio/playground/xiao.mp3"
        } else if(sure_skin === 10) {
            bgm.src = "https://www.genball.cn/static/audio/playground/zhongli.mp3"
        }*/
    

    }
    show() {
        this.$bgm.show();
    }
    hide() {
        this.$bgm.hide();
    }
    stop() {
        this.$bgm.stop();
    }
}

