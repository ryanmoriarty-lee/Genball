class ColdWarning extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;

        this.ctx = this.playground.game_map.ctx;
        this.spent_time = 0;

        this.white_alpha = 1;
        this.cyan_alpha = 0.01;
        this.control_alpha = true;
        this.control_rate = 0;

        this.change_next = 1;
    }

    start() {
    }



    update() {
        this.spent_time += this.timedelta / 1000;

        if (this.playground.players.length > 0 && this.playground.players[0].character === "me") {
            if (this.playground.players[0].cold_num >= 70 && this.playground.players[0].cold_num < 100) {
                if (this.control_alpha) {
                    this.control_rate += 0.007;
                    if (this.control_rate >= 1) this.control_alpha = false;
                }
                else {
                    this.control_rate -= 0.007;
                    if (this.control_rate <= 0.2) this.control_alpha = true;
                }
            }
            else if (this.playground.players[0].cold_num === 100) {
                this.control_rate = Math.min(this.control_rate + 0.007, 1)
            } else (
                this.control_rate = Math.max(this.control_rate - 0.007, 0)
            )
        } else {
            this.control_rate = 0;
        }

        this.render();

    }

    render() {
        let grid = null;
        // this.ctx.clearRect(0, 0, this.playground.width * 0.2, this.playground.height);
        // this.ctx.clearRect(this.playground.width * 0.8, 0, this.playground.width * 0.2, this.playground.height);
        // this.ctx.clearRect(0, 0, this.playground.width, this.playground.height * 0.2);
        // this.ctx.clearRect(0, this.playground.height * 0.8, this.playground.width, this.playground.height * 0.2);

        //左
        grid = this.ctx.createLinearGradient(0, this.playground.height / 2, this.playground.width * 0.2, this.playground.height / 2);
        grid.addColorStop(0, "rgba(255,255,255," + (this.white_alpha * this.control_rate).toString() + ")");
        grid.addColorStop(1, 'rgba(176,224,230,' + (this.cyan_alpha * this.control_rate).toString() + ")");
        this.ctx.lineWidth = 0;
        this.ctx.fillStyle = grid;
        this.ctx.fillRect(0, 0, this.playground.width * 0.2, this.playground.height);

        //右
        grid = this.ctx.createLinearGradient(this.playground.width, this.playground.height / 2, this.playground.width * 0.8, this.playground.height / 2);
        grid.addColorStop(0, "rgba(255,255,255," + (this.white_alpha * this.control_rate).toString() + ")");
        grid.addColorStop(1, 'rgba(176,224,230,' + (this.cyan_alpha * this.control_rate).toString() + ")");
        this.ctx.lineWidth = 0;
        this.ctx.fillStyle = grid;
        this.ctx.fillRect(this.playground.width * 0.8, 0, this.playground.width * 0.2, this.playground.height);

        //上
        grid = this.ctx.createLinearGradient(this.playground.width / 2, 0, this.playground.width / 2, this.playground.height * 0.2);
        grid.addColorStop(0, "rgba(255,255,255," + (this.white_alpha * this.control_rate).toString() + ")");
        grid.addColorStop(1, 'rgba(176,224,230,' + (this.cyan_alpha * this.control_rate).toString() + ")");
        this.ctx.lineWidth = 0;
        this.ctx.fillStyle = grid;
        this.ctx.fillRect(0, 0, this.playground.width, this.playground.height * 0.2);

        //下
        grid = this.ctx.createLinearGradient(this.playground.width / 2, this.playground.height, this.playground.width / 2, this.playground.height * 0.8);
        grid.addColorStop(0, "rgba(255,255,255," + (this.white_alpha * this.control_rate).toString() + ")");
        grid.addColorStop(1, 'rgba(176,224,230,' + (this.cyan_alpha * this.control_rate).toString() + ")");
        this.ctx.lineWidth = 0;
        this.ctx.fillStyle = grid;
        this.ctx.fillRect(0, this.playground.height * 0.8, this.playground.width, this.playground.height * 0.2);
    }
}
