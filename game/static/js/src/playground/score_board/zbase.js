class ScoreBoard extends AcGameObject {
    constructor(playground) {
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;

        this.state = null;

        this.win_img = new Image();
        this.win_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_8f58341a5e-win.png";

        this.lose_img = new Image();
        this.lose_img.src = "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/utils/Noob.png";
    }

    start() {
    }

    add_listening_events() {
        let outer = this;
        let $canvas = null;
        if (this.playground.game_map.$canvas) {
            $canvas = this.playground.game_map.$canvas;
        }

        if ($canvas) {
            $canvas.on('click', function () {
                outer.playground.hide();
                outer.playground.root.menu.show();
            });
        }
    }

    win() {
        this.state = "win";

        let outer = this;
        setTimeout(function () {
            outer.add_listening_events();
        }, 1000);
    }

    lose() {
        this.state = "lose";

        let outer = this;
        setTimeout(function () {
            outer.add_listening_events();
        }, 1000);
    }

    late_update() {
        this.render();
    }

    render() {
        if (this.state === "win") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.playground.width / 2, this.playground.height / 2, this.playground.height * 0.15, 0, Math.PI * 2, false);
            this.ctx.clip();
            this.ctx.drawImage(this.win_img, this.playground.width / 2 - this.playground.height * 0.15, this.playground.height / 2 - this.playground.height * 0.15, this.playground.height * 0.15 * 2, this.playground.height * 0.15 * 2);
            this.ctx.restore();
        } else if (this.state === "lose") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.playground.width / 2, this.playground.height / 2, this.playground.height * 0.15, 0, Math.PI * 2, false);
            this.ctx.clip();
            this.ctx.drawImage(this.lose_img, this.playground.width / 2 - this.playground.height * 0.15, this.playground.height / 2 - this.playground.height * 0.15, this.playground.height * 0.15 * 2, this.playground.height * 0.15 * 2);
            this.ctx.restore();
        }
    }
}