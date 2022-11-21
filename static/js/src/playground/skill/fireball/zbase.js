class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage, special_effect, is_elastic) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.eps = 0.05;
        this.damage = damage;
        this.origin_move_length = this.move_length;
        this.is_elastic = is_elastic;

        //霰弹特效
        this.special_effect = special_effect;

    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            if (this.special_effect) {
                this.se_imp();
            }

            if(this.playground.mode === "multi mode") {
                this.on_destroy();
            }

            this.destroy();
            return false;
        }

        this.update_move();

        if (this.playground.mode === "single mode") {
            this.update_attack();
        } else {
            if (this.player.character === "enemy") {
                this.update_attack();
            }
        }

        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);

        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        if (this.is_elastic) {
            if (this.x - this.radius <= 0 || this.x + this.radius >= this.playground.virtual_map_width) {
                this.vx = -this.vx;
            }

            if (this.y - this.radius <= 0 || this.y + this.radius >= this.playground.virtual_map_height) {
                this.vy = -this.vy;
            }
        }
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player != player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        if (this.playground.players.length <= 1) return false;

        //含集火时的判定
        if (this.player.character === "robot" && this.playground.players.length < 20) {
            if (this.playground.players[0].character === "me") {
                if (player.character === "me") {
                    let distance = this.get_dist(this.x, this.y, player.x, player.y);
                    if (distance < this.radius + player.radius)
                        return true;
                }
            } else {
                let distance = this.get_dist(this.x, this.y, player.x, player.y);
                if (distance < this.radius + player.radius)
                    return true;
            }
        } else {
            let distance = this.get_dist(this.x, this.y, player.x, player.y);
            if (distance < this.radius + player.radius)
                return true;
        }

        return false;
    }

    se_imp() {
        let ball_num = 10;

        for (let i = 0; i < ball_num; i++) {
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let new_color = null;
            let ranint = Math.random();

            if (this.player.character === "me") {
                if (ranint <= 0.5) new_color = "WhiteSmoke";
                else new_color = "CornflowerBlue";
            } else {
                new_color = "OrangeRed";
            }

            if (this.playground.mode === "single mode") {
                new FireBall(this.playground, this.player, this.x, this.y, this.radius / 1.5, vx, vy, new_color, this.speed * 0.5, this.origin_move_length / 4.0, this.damage / 2, false, true);
            }
            else {
                if (this.player.character === "me") {
                    let ball = new FireBall(this.playground, this.player, this.x, this.y, this.radius / 1.5, vx, vy, new_color, this.speed * 0.5, this.origin_move_length / 4.0, this.damage / 2, false, true);
                    this.player.fireballs.push(ball);
                    this.playground.mps.send_create_ball(this.player.uuid, ball.uuid, this.x, this.y, this.radius / 1.5, vx, vy, "OrangeRed", this.speed * 0.5, this.origin_move_length / 4.0, this.damage / 2, false, true);
                }
            }
        }
    }

    update_ball_trace(x, y, vx, vy, move_length) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.move_length = move_length;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);

        if (this.is_elastic) {
            let angle = Math.random() * 2 * Math.PI;
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            this.vx = vx;
            this.vy = vy;

            if (this.player.character === "me" || this.player.character === "enemy") {
                this.move_length = this.origin_move_length * 1.5;
                if(this.playground.mode === "multi mode") {
                    this.playground.mps.send_update_ball_trace(this.player.uuid, this.uuid, this.x, this.y, vx, vy, this.move_length);
                }
            } else {
                this.move_length = this.origin_move_length * 0.8;
            }

        } else {
            this.destroy();
            if (this.special_effect) this.se_imp();
        }

        player.is_attacked(angle, this.damage, false, true);
        if (this.playground.mode === "multi mode") {
            this.playground.mps.send_is_attack(this.player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }
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

    on_destroy() {
        let fireballs = this.player.fireballs;
        for (let i = 0; i < fireballs.length; i++) {
            if (fireballs[i] === this) {
                fireballs.splice(i, 1);
                break;
            }
        }
    }

}
