class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;
        this.ws = new WebSocket("wss://www.genball.cn/wss/multiplayer/");
        this.start();
    }

    start() {
        this.receive();
    }

    receive() {
        let outer = this;

        this.ws.onmessage = function (e) {
            let data = JSON.parse(e.data);
            let event = data.event;

            let uuid = data.uuid;

            if (uuid === outer.uuid) return false;

            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.sure_skin, data.player_x, data.player_y);
            } else if (event === "move_to") {
                outer.receive_move_to(uuid, data.tx, data.ty);
            } else if (event === "shoot_fireball") {
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid, data.is_se);
            } else if (event === "attack") {
                outer.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            } else if (event === "update_ball_trace") {
                outer.receive_update_ball_trace(data.owner_uuid, data.ball_uuid, data.x, data.y, data.vx, data.vy, data.move_length);
            } else if (event === "create_ball") {
                outer.receive_create_ball(data.uuid, data.ball_uuid, data.x, data.y, data.radius, data.vx, data.vy, data.color, data.speed, data.move_length, data.damage, data.se, data.is_elastic);
            } else if (event === "block") {
                outer.receive_block(data.blocker_uuid, data.blockee_uuid, data.ball_uuid, data.vx, data.vy, data.angle);
            } else if (event === "hp_decrease") {
                outer.receive_hp_decrease(data.uuid, data.damage);
            } else if (event === "destroy_ball") {
                outer.receive_destroy_ball(data.owner_uuid, data.ball_uuid);
            } else if (event === "update_damage_player") {
                outer.receive_update_damage_player(data.damager_uuid, data.damage_x, data.damage_y, data.damage_speed, data.x, data.y);
            } else if (event === "is_attack") {
                outer.receive_is_attack(data.uuid, data.attacker_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            } else if (event === "message") {
                outer.receive_message(uuid, data.username, data.text);
            } else if (event === "make_particle") {
                outer.receive_make_particle(data.x, data.y, data.vx, data.vy, data.radius, data.color, data.speed, data.move_length);
            } else if (event === "update_player") {
                outer.receive_update_player(uuid, data.hp, data.x, data.y, data.vx, data.vy, data.damage_x, data.damage_y, data.damage_speed);
            } else if (event === "player_die") {
                outer.receive_player_die(uuid);
            } else if (event === "make_diffusion_ball") {
                outer.receive_make_diffusion_ball(uuid);
            }
        };
    }

    // receive_create(uuid, ball_uuid, x, y, radius, vx, vy, color, speed, move_length, damage, se, is_elastic) {


    send_create_player(username, sure_skin, player_x, player_y) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'sure_skin': sure_skin,
            'player_x': player_x,
            'player_y': player_y,
        }));
    }

    get_player(uuid) {
        let players = this.playground.players;
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (player.uuid === uuid)
                return player;
        }
        return null;
    }

    get_player_ball(uuid, ball_uuid) {
        let player = this.get_player(uuid);
        let fireballs = player.fireballs;
        for (let i = 0; i < fireballs.length; i++) {
            if (ball_uuid === fireballs[i].uuid) {
                return fireballs[i];
            }
        }
        return null;
    }


    receive_create_player(uuid, username, sure_skin, player_x, player_y) {
        let player = new Player(
            this.playground,
            player_x,
            player_y,
            0.05,
            this.playground.get_random_color(),
            0.15,
            "enemy",
            username,
            sure_skin,
        );

        player.uuid = uuid;
        this.playground.players.push(player);
    }

    send_move_to(tx, ty) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "move_to",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));

        // this.ws.send(JSON.stringify({
        //     'event': "create_player",
        //     'uuid': outer.uuid,
        //     'username': username,
        //     'sure_skin': sure_skin
        // }));
    }

    receive_move_to(uuid, tx, ty) {
        let player = this.get_player(uuid);
        if (player) {
            player.move_to(tx, ty);
        }
    }

    send_shoot_fireball(tx, ty, ball_uuid, is_se) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "shoot_fireball",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
            'is_se': is_se,
        }));
    }

    receive_shoot_fireball(uuid, tx, ty, ball_uuid, is_se) {
        let player = this.get_player(uuid);
        if (player) {
            let fireball = null;
            if (!is_se) fireball = player.shoot_fireball(tx, ty, false);
            else fireball = player.shoot_fireball(tx, ty, true);
            fireball.uuid = ball_uuid;
        }
    }


    //历史遗留产物，这个attack是指攻击者发出给别人的
    send_attack(attackee_uuid, x, y, angle, damage, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "attack",
            'uuid': outer.uuid,
            "attackee_uuid": attackee_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_attack(uuid, attackee_uuid, x, y, angle, damage, ball_uuid) {
        let attacker = this.get_player(uuid);
        let attackee = this.get_player(attackee_uuid);
        if (attackee && attacker) {
            attackee.receive_attack(x, y, angle, damage, ball_uuid, attacker);
        }
    }


    //新的，这个attack是由被攻击者发出给别人的
    send_is_attack(attacker_uuid, x, y, angle, damage, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "is_attack",
            'uuid': outer.uuid,
            "attacker_uuid": attacker_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_is_attack(uuid, attacker_uuid, x, y, angle, damage, ball_uuid) {
        let attacker = this.get_player(attacker_uuid);
        let attackee = this.get_player(uuid);
        if (attackee && attacker) {
            attackee.receive_attack(x, y, angle, damage, ball_uuid, attacker);
        }
    }

    send_update_ball_trace(owner_uuid, ball_uuid, x, y, vx, vy, move_length) {
        this.ws.send(JSON.stringify({
            'event': "update_ball_trace",
            'owner_uuid': owner_uuid,
            'x': x,
            'y': y,
            'vx': vx,
            'vy': vy,
            'ball_uuid': ball_uuid,
            'move_length': move_length,
        }));
    }

    receive_update_ball_trace(owner_uuid, ball_uuid, x, y, vx, vy, move_length) {
        let ball = this.get_player_ball(owner_uuid, ball_uuid);
        if (ball) {
            ball.update_ball_trace(x, y, vx, vy, move_length);
        }
    }


    send_create_ball(uuid, ball_uuid, x, y, radius, vx, vy, color, speed, move_length, damage, se, is_elastic) {
        this.ws.send(JSON.stringify({
            'event': "create_ball",
            'uuid': uuid,
            'x': x,
            'y': y,
            'vx': vx,
            'vy': vy,
            'color': color,
            'radius': radius,
            'speed': speed,
            'move_length': move_length,
            'damage': damage,
            'se': se,
            'is_elastic': is_elastic,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_create_ball(uuid, ball_uuid, x, y, radius, vx, vy, color, speed, move_length, damage, se, is_elastic) {
        let player = this.get_player(uuid);
        if (player) {
            let ball = new FireBall(this.playground, player, x, y, radius, vx, vy, color, speed, move_length, damage, se, is_elastic);
            ball.uuid = ball_uuid;
            player.fireballs.push(ball);
        }
    }

    send_block(blocker_uuid, blockee_uuid, ball_uuid, vx, vy, angle) {
        this.ws.send(JSON.stringify({
            'event': "block",
            'blocker_uuid': blocker_uuid,
            'blockee_uuid': blockee_uuid,
            'ball_uuid': ball_uuid,
            'vx': vx,
            'vy': vy,
            'angle': angle,
        }));
    }

    receive_block(blocker_uuid, blockee_uuid, ball_uuid, vx, vy, angle) {
        let blocker = this.get_player(blocker_uuid);
        let blockee = this.get_player(blockee_uuid);

        if (blockee && blocker) {
            let ball = this.get_player_ball(blockee_uuid, ball_uuid);
            if (ball) {
                ball.vx = vx;
                ball.vy = vy;

                if (!ball.special_effect) {
                    ball.player = blocker;
                    if (blocker.character === "me") ball.color = "CornflowerBlue";
                    else ball.color = "OrangeRed";
                    ball.speed = 0.15 * 3;
                    ball.is_elastic = true;
                    ball.special_effect = true;
                    ball.move_length = ball.origin_move_length;
                }

                for (let i = 0; i < 15 + Math.random() * 10; i++) {
                    let radius = ball.radius * 0.2;
                    let fire_angle = angle;
                    if (Math.random() > 0.5) fire_angle += Math.random() * 1 / 6 * Math.PI;
                    else fire_angle -= Math.random() * 1 / 6 * Math.PI;
                    let vx = Math.cos(fire_angle);
                    let vy = Math.sin(fire_angle);
                    let color = ball.color;
                    let speed = 0.15 * 3 * 2.5 + 0.15 * 3 * 2.5 * Math.random();
                    let move_length = blocker.radius * 10 * Math.random();
                    new Particle(this.playground, ball.x, ball.y, radius, vx, vy, color, speed, move_length);
                }

                blocker.damage_speed = blocker.default_damage_speed * 0.4;
                blocker.damage_x = Math.cos(angle - Math.PI);
                blocker.damage_y = Math.sin(angle - Math.PI);

                blocker.fireballs.push(ball);
            }
        }
    }

    send_hp_decrease(uuid, damage) {
        this.ws.send(JSON.stringify({
            'event': "hp_decrease",
            'uuid': uuid,
            'damage': damage,
        }));
    }

    receive_hp_decrease(uuid, damage) {
        let player = this.get_player(uuid);
        if (player && (player.uuid != this.uuid)) {
            player.is_attacked(null, damage, true, false);
        }
    }

    send_destroy_ball(owner_uuid, ball_uuid) {
        this.ws.send(JSON.stringify({
            'event': "destroy_ball",
            'owner_uuid': owner_uuid,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_destroy_ball(owner_uuid, ball_uuid) {
        let player = this.get_player(owner_uuid);
        if (player) {
            let ball = this.get_player_ball(owner_uuid, ball_uuid);
            if (ball) ball.on_destroy(), ball.destroy();
        }
    }

    send_update_damage_player(damager_uuid, damage_x, damage_y, damage_speed, x, y) {
        this.ws.send(JSON.stringify({
            'event': "update_damage_player",
            'damager_uuid': damager_uuid,
            'damage_x': damage_x,
            'damage_y': damage_y,
            'damage_speed': damage_speed,
            'x': x,
            'y': y,
        }));
    }

    receive_update_damage_player(damager_uuid, damage_x, damage_y, damage_speed, x, y) {
        let player = this.get_player(damager_uuid);
        if (player) {
            player.x = x;
            player.y = y;
            player.damage_x = damage_x;
            player.damage_y = damage_y;
            player.damage_speed = damage_speed;
        }
    }

    send_message(username, text) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "message",
            'uuid': outer.uuid,
            'text': text,
            'username': username,
        }))
    }

    receive_message(uuid, username, text) {
        this.playground.chat_field.add_message(username, text);
    }

    send_make_particle(x, y, vx, vy, radius, color, speed, move_length) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "make_particle",
            'uuid': outer.uuid,
            'x': x,
            'y': y,
            'vx': vx,
            'vy': vy,
            'radius': radius,
            'color': color,
            'speed': speed,
            'move_length': move_length
        }))
    }

    receive_make_particle(x, y, vx, vy, radius, color, speed, move_length) {
        new Particle(this.playground, x, y, radius * 0.5 + radius * Math.random(), vx, vy, color, speed, move_length * 0.5 + move_length * Math.random());
    }

    send_update_player(hp, x, y, vx, vy, damage_x, damage_y, damage_speed) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "update_player",
            'uuid': outer.uuid,
            'hp': hp,
            'x': x,
            'y': y,
            'vx': vx,
            'vy': vy,
            'damage_x': damage_x,
            'damage_y': damage_y,
            'damage_speed': damage_speed,
        }))
    }

    receive_update_player(uuid, hp, x, y, vx, vy, damage_x, damage_y, damage_speed) {
        let player = this.get_player(uuid);
        if (player) {
            player.hp = hp;
            player.x = x;
            player.y = y;
            player.vx = vx;
            player.vy = vy;
            player.damage_x = damage_x;
            player.damage_y = damage_y;
            player.damage_speed = damage_speed;
        }
    }

    send_player_die() {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "player_die",
            'uuid': outer.uuid,
        }))
    }

    receive_player_die(uuid) {
        let player = this.get_player(uuid);
        if (player) player.destroy();
    }

    send_make_diffusion_ball() {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "make_diffusion_ball",
            'uuid': outer.uuid,
        }))
    }

    receive_make_diffusion_ball(uuid) {
        let player = this.get_player(uuid);
        if (player) {
            player.diffusion();
        }
    }
}

