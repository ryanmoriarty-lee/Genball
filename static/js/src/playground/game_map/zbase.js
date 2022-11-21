class GameMap extends AcGameObject {
    constructor(playground) {
        super ();
        this.playground = playground;
        this.$canvas = $(`<canvas class = "ac-game-playground-game-map" tabindex=0></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
        // this.end_img = new Image();
        // this.end_img.src = "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/utils/Noob.png";

        let width = this.playground.virtual_map_width;
        let height = this.playground.virtual_map_height;
        this.l = height * 0.05;
        this.nx = Math.ceil(width / this.l);
        this.ny = Math.ceil(height / this.l);

    }

    start() {
        this.$canvas.focus();
    }

    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(176,224,230)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    

    update() {
        this.render();
    }

    render() {
        if(this.playground.players.length > 0 && this.playground.players[0].character === "me") {
            this.ctx.fillStyle = "rgba(176,224,230, 0.8)";
        } else {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        }
        //this.ctx.fillStyle = "rgba(225, 255, 255)";
        
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        if(Math.random() > 0.2) new Snow(this.playground,0,0);

        if(this.playground.players.length > 0 && this.playground.players[0].character != "me"){

            let playground = document.getElementsByClassName("ac-game-playground")[0];
            playground.style.background = "black";

            // this.ctx.save();
            // this.ctx.beginPath();
            // this.ctx.arc(this.playground.width / 2, this.playground.height / 2, this.playground.height * 0.15, 0, Math.PI * 2, false);
            // //this.ctx.stroke();
            // this.ctx.clip();
            // this.ctx.drawImage(this.end_img, this.playground.width / 2 - this.playground.height * 0.15, this.playground.height / 2 - this.playground.height * 0.15, this.playground.height * 0.15 * 2, this.playground.height * 0.15 * 2);
            // this.ctx.restore();

            let bgm = document.getElementsByClassName("ac-game-playground-bgm")[0];
            if(bgm.src != "https://www.genball.cn/static/audio/playground/end_bgm.mp3") {
                bgm.src = "https://www.genball.cn/static/audio/playground/end_bgm.mp3";
            }
        }
    }
}

