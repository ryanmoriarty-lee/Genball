class ChooseSkin {
    constructor(root) {
        this.root = root;
        this.$choose_skin = $(`
<div class = "ac-game-choose-skin">
    <audio class="ac-game-choose-skin-sound" src = "" autoplay='autoplay'></audio>
    <audio class="ac-game-choose-skin-bgm" src="" autoplay='autoplay' loop='loop'></audio>
    <img class = "ac-game-choose-skin-show" src = "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/hutao.png">
    <div class = "ac-game-choose-skin-change-left">
    </div>
    <div class = "ac-game-choose-skin-change-right">
    </div>
    <p class = "ac-game-choose-skin-name"></p>
    <div class = "ac-game-choose-skin-sure">确定</div>
</div>
`);


        this.$choose_skin.hide();
        this.root.$ac_game.append(this.$choose_skin);
        this.width = this.$choose_skin.width();
        this.height = this.$choose_skin.height();
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
        //this.$choose_skin.append(this.$canvas);
        this.id = 0;
        this.mode = null;

        /*this.$change_and_sure = $(`
    <div class = "ac-game-choose-skin-change-left">
    </div>
    <div class = "ac-game-choose-skin-change-right">
    </div>
    <div class = "ac-game-choose-skin-sure">确定</div>
    `)*/

        this.$left_mode = this.$choose_skin.find('.ac-game-choose-skin-change-left');
        this.$right_mode = this.$choose_skin.find('.ac-game-choose-skin-change-right');
        this.$sure_mode = this.$choose_skin.find('.ac-game-choose-skin-sure');

        this.start();
    }

    start() {
        this.add_listening_events();
        this.draw_skin();
    }

    get_random_meme() {
        let id = Math.floor(Math.random() * meme.length);
        while (id === 0) {
            id = Math.floor(Math.random() * meme.length);
        }
        return id;
    }

    add_listening_events() {
        let outer = this;
        this.$left_mode.click(function () {
            outer.id--;
            if (outer.id < 0) { outer.id = meme.length - 1; }
            outer.draw_skin();
            outer.change_bgm();

        });

        this.$right_mode.click(function () {
            outer.id++;
            if (outer.id === meme.length) { outer.id = 0; }
            outer.draw_skin();
            outer.change_bgm();
        });
        this.$sure_mode.click(function () {
            outer.hide();
            if (outer.id === 0) outer.id = outer.get_random_meme();
            outer.draw_skin();
            let c_bgm = document.getElementsByClassName("ac-game-choose-skin-bgm")[0];
            c_bgm.src = ""
            outer.ctx.clearRect(0, 0, outer.width, outer.height);
            outer.root.playground.show(outer.mode, outer.id);
        });

    }

    show(mode) {
        this.$choose_skin.show();
        this.mode = mode;
    }

    hide() {
        this.$choose_skin.hide();
    }

    draw_skin() {
        let img = document.getElementsByClassName("ac-game-choose-skin-show")[0];
        img.src = meme[this.id];
        //console.log(img.style.background-image);
        let name = document.getElementsByClassName("ac-game-choose-skin-name")[0];
name.innerHTML = skin_name[this.id]
    }

change_bgm(){
    let sound = document.getElementsByClassName("ac-game-choose-skin-sound")[0];
    sound.src = choose_skin_bgm[this.id];
    sound.volume = 0.75
    let bgm = document.getElementsByClassName("ac-game-choose-skin-bgm")[0];
    bgm.src = music_src[this.id]
    bgm.volume = 0.5;
}
}
