class DiffusionBall extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length, player, is_first) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.origin_move_length = move_length;
        this.is_first = is_first;
        this.player = player;
        this.friction = 0.95;
        this.eps = 0.01;
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps || this.speed < this.eps) {
            if (this.is_first) {
                for (let i = 0; i < 22.5; i++) {
                    let radius = 0.002;
                    let angle = Math.PI / 11.25 * i;
                    let vx = Math.cos(angle);
                    let vy = Math.sin(angle);
                    let color = 'rgba(255,99,71, 0.6)';
                    let speed = 0.075 * 11.25;
                    let move_length = this.origin_move_length * 2;
                    new DiffusionBall(this.playground, this.x, this.y, radius, vx, vy, color, speed, move_length, this.player, false);
                }

                if (this.player.character === "me") {
                    for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
                        let obj = AC_GAME_OBJECTS[i];
                        if (obj instanceof Player) {
                            let player = obj;
                            if (player != this.player) {
                                let distance = this.get_dist(this.x, this.y, player.x, player.y);
                                if (distance < this.origin_move_length * 2) {
                                    let angle = Math.atan2(player.y - this.y, player.x - this.x);
                                    player.is_attacked(angle, 1, false, true);
                                    if (this.playground.mode === "multi mode") {
                                        this.playground.mps.send_attack(player.uuid, player.x, player.y, angle, 1, null);
                                    }
                                }
                            }
                        } else if (obj instanceof FireBall && obj.player != this.player) {
                            let distance = this.get_dist(this.x, this.y, obj.x, obj.y);
                            if (distance < this.origin_move_length * 2) {
                                if (this.playground.mode === "single mode") {
                                    obj.destroy();
                                } else {
                                    this.playground.mps.send_destroy_ball(obj.player.uuid, obj.uuid);
                                }
                            }
                        }
                    }
                }
            }

            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
        this.speed *= this.friction;

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

