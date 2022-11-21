class Snow extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;

            this.x = Math.random() * this.playground.virtual_map_width;
            this.y = Math.random() * this.playground.virtual_map_height;

        this.radius = 0.005;
        this.next_radius = this.radius;
        this.inner_radius = 0;

        this.color = 'rgba(255,255,255,' + 0.5 * Math.random().toString() + ')';

        this.vx = 0;
        this.vy = 0.2 + Math.random();
        this.speed = 0.1;

        this.ctx = this.playground.game_map.ctx;
        this.change_next = 1;
        this.eps = 0.01;

        this.spent_time = 0;

    }

    start() {
    }

    update() {
        this.spent_time += this.timedelta / 1000;

        if (this.spent_time > this.change_next) {
            this.change_next += 2 + Math.random();
            this.vx = Math.cos(Math.PI * Math.random());
        }

        this.update_move();

        this.render();
    }

    update_move() {
        if (this.y > this.playground.virtual_map_height) {
            this.destroy();
            return false;
        }

        let moved = this.speed * this.timedelta / 1000;
        this.x += this.vx * moved * 0.2;
        this.y += this.vy * moved;

        this.render();
    }

    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy;

        if (ctx_x < -0.2 * this.playground.width / scale ||
            ctx_x > 1.2 * this.playground.width / scale ||
            ctx_y < -0.2 * this.playground.height / scale ||
            ctx_y > 1.2 * this.playground.height / scale) {
            return;
        }

        this.ctx.beginPath();
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
