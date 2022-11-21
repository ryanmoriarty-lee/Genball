class Warmer extends AcGameObject {
    constructor(playground, x, y, radius) {
        super();
        this.playground = playground;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.ctx = this.playground.game_map.ctx;
        this.inner_radius = this.radius * 0.5;
        this.spent_time = 0;

        this.change_next = 1;
        this.next_radius = this.radius;


    }

    start() {
    }

    update() {
        this.spent_time += this.timedelta / 1000;

        if (this.spent_time > this.change_next) {
            this.change_next += 0.5 * Math.random();
            this.next_radius = 0.6 * this.radius + Math.random() * this.radius;
            if (this.next_radius > this.radius) this.next_radius = this.radius;

            //调节频率
            if (Math.random() > 0.5) {
                for (let i = 0; i < 15 + Math.random() * 10; i++) {
                    let radius = this.inner_radius * Math.random() * 0.15;
                    let angle = Math.PI * 2 * Math.random();
                    let vx = Math.cos(angle);
                    let vy = Math.sin(angle);
                    let color = 'rgba(255,99,71, 0.6)';
                    let speed = 0.15 * 11.25;
                    let move_length = this.radius * Math.random() * 10;
                    new Particle(this.playground, this.x, this.y, radius, vx, vy, color, speed, move_length);
                }
            }
        }

        if (this.inner_radius < this.next_radius) this.inner_radius += 0.001;
        else this.inner_radius -= 0.001;

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
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.inner_radius * scale, 0, Math.PI * 2, false);
        let grid = this.ctx.createRadialGradient(ctx_x * scale, ctx_y * scale, 0, ctx_x * scale, ctx_y * scale, this.inner_radius * scale);
        grid.addColorStop(0, 'rgba(255,69,0, 0.8)');
        grid.addColorStop(0.5, 'rgba(255,99,71)');
        grid.addColorStop(1, 'rgba(176,224,230, 0.4)');
        this.ctx.fillStyle = grid;
        this.ctx.fill();
        this.ctx.restore();
        this.ctx.closePath();

        // this.ctx.beginPath();
        // this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * 4 * scale, 0, Math.PI * 2, false);
        // this.ctx.lineWidth = 1;
        // this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        // this.ctx.stroke();
        // this.ctx.closePath();
    }
}
