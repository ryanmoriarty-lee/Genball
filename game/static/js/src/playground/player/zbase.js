class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, sure_skin) {
        super();

        //基础模组
        this.x = x;
        this.y = y;
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.radius = radius;
        this.origin_speed = speed;
        this.speed = speed;
        this.color = color;
        this.character = character;
        this.username = username;
        this.sure_skin = sure_skin;

        //寒冷值
        this.is_cold = true;
        this.is_cold_max = false;
        this.cold_num = 0;
        this.next_update_code_num = 0;
        this.next_reduce_code_num = 0;
        this.next_reduce_hp = 0;

        //同步用的计时器
        this.next_update_pos = 1;


        //ai专用
        this.draw_hp_ftime = null; //绘制hp圈的结束时间
        this.draw_hp_time = 3; //绘制hp圈的总时间

        //移动模组
        this.eps = 0.01;
        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;


        this.friction = 0.94;
        this.spent_time = 0;

        //受伤模组
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.default_damage_speed = 1.5;


        //火球存放模组
        this.fireballs = [];

        //技能判定模组
        this.cur_skill = null;
        this.skill_stime = 0; //起始时间
        this.skill_ptime = 0; //长按时间
        this.skill_ftime = 0; //结束时间
        this.skill_over = true;
        this.skill_ready = false;
        this.need_draw = false; //是否需要画技能特效
        if (this.character === "me") {
            // this.xxx_cold_time = xxx
        }

        //q
        this.q_cd = 1.5;

        //e
        this.e_show_circle = false;
        this.e_stime = null;
        this.e_ftime = null;
        this.e_last_time = 0.2;

        //d
        this.d_show_circle = false;
        this.d_make_time = null;
        this.d_cold_time = 2;
        this.d_can = true;

        //r
        // this.r_last_time = 10;
        // this.r_stime = null;
        // this.rx = null;
        // this.ry = null;
        // this.r_none = 1;
        // this.r_part_time = 2;
        // this.r_next = null;
        // this.r_ftime = null;

        //状态
        this.hp = 100; //体力值
        this.tv = 0; //疲劳值
        this.hp_length = 1;
        this.cold_length = 0;

        //一定要改相对
        //初始状态数值
        //scalse
        this.style_one_max_hp = 100;
        this.style_one_radius = 0.05;
        this.style_one_speed = 0.15;
        //第二阶段状态数值
        this.style_two_max_hp = 80;
        // this.style_two_radius = this.style_one_radius * 0.75;
        this.style_two_radius = this.style_one_radius;
        this.style_two_speed = this.style_one_speed * 1.4;
        //第三阶段状态数值
        this.style_three_max_hp = 50;
        // this.style_three_radius = this.style_two_radius * 0.75;
        this.style_three_radius = this.style_two_radius;
        this.style_three_speed = this.style_two_speed * 1.4;
        //第四阶段状态数值 
        this.style_four_max_hp = 20;
        // this.style_four_radius = this.style_three_radius * 0.75;
        this.style_four_radius = this.style_three_radius;
        this.style_four_speed = this.style_three_speed * 1.4;


        //鼠标悬停定位
        this.mouseX = 0;
        this.mouseY = 0;

        //填充玩家和ai的皮肤
        if (this.character === "me" || this.character === "enemy") {
            this.img = new Image();
            this.img.src = meme[this.sure_skin];
            let bgm = document.getElementsByClassName("ac-game-playground-bgm")[0];

            // if (this.playground.mode === "single mode") {
            if (this.character === "me") {
                bgm.src = music_src[this.sure_skin];
                bgm.volume = 0.5;
            }
            // } else {
            //     if (!this.playground.multi_bgm) {
            //         this.playground.multi_bgm = true;
            //         bgm.src = multi_bgm;
            //     }
            // }

        } else if (this.character === "robot") {
            this.img = new Image();
            this.img.src = this.playground.get_random_enemys();
        }

    }

    start() {
        if (this.playground.mode === "multi mode") {
            this.playground.player_count++;
            this.playground.notice_board.write("已就绪：" + this.playground.player_count + "人");

            if (this.playground.player_count >= 2) {
                this.playground.state = "fighting";
                this.playground.notice_board.write("Fighting");
            }
        }

        if (this.character === "me") {
            this.add_listening_events();
        } else if (this.character === "robot") {
            let tx = Math.random() * this.playground.virtual_map_width;
            let ty = Math.random() * this.playground.virtual_map_height;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        // let rect = null;
        //修正acapp端的鼠标位置偏差
        // const rect = outer.ctx.canvas.getBoundingClientRect();


        //禁止右键弹出工具窗口
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });

        this.playground.game_map.$canvas.mousedown(function (e) {
            if (outer.playground.mode === "single mode" || (outer.playground.mode === "multi mode" && outer.playground.state === "fighting")) {
                const rect = outer.ctx.canvas.getBoundingClientRect();

                if (e.which === 3) {
                    //鼠标右键的粒子效果
                    //scalse
                    for (let i = 0; i < 10 + Math.random() * 10; i++) {
                        let radius = 0.05 * Math.random() * 0.1;
                        let angle = Math.PI * 2 * Math.random();
                        let vx = Math.cos(angle);
                        let vy = Math.sin(angle);
                        let color = outer.color;
                        let speed = 0.15 * 5;
                        let move_length = 0.05 * Math.random() * 3.5;
                        new Particle(outer.playground, (e.clientX - rect.left) / outer.playground.scale + outer.playground.cx, (e.clientY - rect.top) / outer.playground.scale + outer.playground.cy, radius, vx, vy, color, speed, move_length);
                    }

                    let tx = (e.clientX - rect.left) / outer.playground.scale + outer.playground.cx;
                    let ty = (e.clientY - rect.top) / outer.playground.scale + outer.playground.cy;
                    outer.move_to(tx, ty);

                    if (outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_move_to(tx, ty);
                    }
                }
            }
        });

        this.playground.game_map.$canvas.keydown(function (e) {

            if (e.which === 13) {
                if (outer.playground.mode === "multi mode") {
                    outer.playground.chat_field.show_input();
                    return false;
                }
            } else if (e.which === 27) {
                if (outer.playground.mode === "multi mode") {
                    outer.playground.chat_field.hide_input();
                }
            }

            if (outer.playground.mode === "single mode" || (outer.playground.mode === "multi mode" && outer.playground.state === "fighting")) {
                if (outer.playground.players.length > 0 && outer.playground.players[0].character === "me" && outer.skill_over) {
                    if (e.which === 81) {
                        outer.skill_stime = outer.spent_time;
                        outer.cur_skill = "q";
                        outer.need_draw = true;
                        // outer.shoot_fireball(outer.mouseX, outer.mouseY);
                    }
                    else if (e.which === 87) {
                        // outer.diffusion();
                        outer.cur_skill = "w";
                    }
                    else if (e.which === 70) {
                        // outer.traction();
                        outer.cur_skill = "f";
                    }
                    else if (e.which === 69) {
                        outer.cur_skill = "e";
                        outer.e_show_circle = true;
                    }
                    else if (e.which === 68 && outer.hp > 5) {
                        outer.cur_skill = "d";
                        outer.d_show_circle = true;
                    } else if (e.which === 32 || e.which === 49) {
                        outer.playground.focus_player = outer;
                        outer.playground.re_cx_cy(outer.x, outer.y);
                    }
                    // else if (e.which === 82) {
                    //     outer.cur_skill = "r";
                    //     outer.r_stime = outer.spent_time;
                    //     outer.r_ftime = outer.r_stime + outer.r_last_time;
                    //     outer.rx = outer.x, outer.ry = outer.y;
                    //     outer.r_next = outer.r_stime;
                    // }
                }

                outer.skill_over = false;
            }
        });

        this.playground.game_map.$canvas.keypress(function (e) {
            if (outer.playground.mode === "single mode" || (outer.playground.mode === "multi mode" && outer.playground.state === "fighting")) {
                if (outer.playground.players.length > 0 && outer.playground.players[0].character === "me") {
                    outer.skill_ptime = outer.spent_time - outer.skill_stime;
                }

                //scale
                if (outer.skill_ptime >= outer.q_cd && outer.skill_ready === false && outer.need_draw) {
                    for (let i = 0; i < 15 + Math.random() * 10; i++) {
                        let x = outer.x, y = outer.y;
                        let radius = 0.05 * Math.random() * 0.2;
                        let angle = Math.PI * 2 * Math.random();
                        let vx = Math.cos(angle);
                        let vy = Math.sin(angle);
                        let color = "CornflowerBlue";
                        let speed = 0.15 * 5;
                        let move_length = 0.05 * Math.random() * 3.5;
                        new Particle(outer.playground, x, y, radius, vx, vy, color, speed, move_length);
                    }

                    outer.skill_ready = true;
                }
            }
        });

        this.playground.game_map.$canvas.on("mousemove", function (e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            outer.mouseX = (e.clientX - rect.left) / outer.playground.scale;
            outer.mouseY = (e.clientY - rect.top) / outer.playground.scale;
        });

        this.playground.game_map.$canvas.keyup(function (e) {
            if (outer.playground.mode === "single mode" || (outer.playground.mode === "multi mode" && outer.playground.state === "fighting")) {

                outer.skill_ftime = outer.spent_time;
                if (outer.playground.players.length > 0 && outer.playground.players[0].character === "me") {
                    if (outer.cur_skill === "q") {
                        if (outer.is_cold) outer.cold_num = Math.min(100, outer.cold_num + 1);
                        let tx = outer.mouseX + outer.playground.cx;
                        let ty = outer.mouseY + outer.playground.cy;
                        if (outer.skill_ptime < outer.q_cd) {

                            let ball = outer.shoot_fireball(tx, ty, false);

                            if (outer.playground.mode === "multi mode") {
                                outer.playground.mps.send_shoot_fireball(tx, ty, ball.uuid, false);
                            }

                        } else {
                            let ball = outer.shoot_fireball(tx, ty, true);
                            if (outer.playground.mode === "multi mode") {
                                outer.playground.mps.send_shoot_fireball(tx, ty, ball.uuid, true);
                            }
                        }
                    }
                    else if (outer.cur_skill === "d") {
                        if (outer.d_can) {
                            if (outer.is_cold) outer.cold_num = Math.min(100, outer.cold_num + 2);
                            outer.diffusion();
                            outer.d_make_time = outer.spent_time;
                            outer.d_can = false;
                        }
                    }
                    else if (outer.cur_skill === "f") {
                        if (outer.is_cold) outer.cold_num = Math.min(100, outer.cold_num + 2);
                        outer.traction();
                    }
                    else if (outer.cur_skill === "e") {
                        if (outer.is_cold) outer.cold_num = Math.min(100, outer.cold_num + 4);
                        outer.e_stime = outer.spent_time;
                        outer.e_ftime = outer.e_stime + outer.e_last_time;
                    }
                    else if (outer.cur_skill === "r") {
                    }

                    //假如要加冷却，则在技能释放时写上
                    //if(outer.xxx_coldtime > outer.eps) retuan false;
                    //还要写上重置技能时间

                }
                outer.skill_over = true;
                outer.cur_skill = null;
                outer.skill_ready = false;
                outer.skill_ptime = 0;
                outer.need_draw = false;
                outer.e_show_circle = false;
                outer.d_show_circle = false;
            }
        });
    }

    //火球
    shoot_fireball(tx, ty, flag) {

        let x = this.x, y = this.y;
        //scale
        let radius = 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);

        //短按颜色
        let color_sp = "orange";
        //长按颜色
        let color_lp = (this.character === "robot" || this.character === "enemy") ? "OrangeRed" : "CornflowerBlue";
        let speed_sp = this.speed * 2;
        //scalse
        let speed_lp = 0.6;

        let move_length = 1.3;
        if (this.character === "me" && this.playground.players[0] != this) return;

        this.damage_speed = this.default_damage_speed * 0.3;
        this.damage_x = Math.cos(angle - Math.PI);
        this.damage_y = Math.sin(angle - Math.PI);

        for (let i = 0; i < 20 + Math.random() * 10; i++) {
            let x = this.x, y = this.y;
            //scalse
            let radius = 0.02 * Math.random() * 0.20;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let color = null;
            if (!flag) color = "orange";
            else {
                if (this.character == "me") color = "CornflowerBlue";
                else color = "OrangeRed";
            }
            //scalse
            let speed = this.default_damage_speed * 0.5;
            let move_length = 1.5 * this.radius + this.radius * Math.random();
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }



        //修改damage
        if (!flag) {
            let ball = new FireBall(this.playground, this, x, y, radius, vx, vy, color_sp, speed_sp, move_length, 5, false, false);
            this.fireballs.push(ball);
            return ball;
        }
        else {
            let ball = new FireBall(this.playground, this, x, y, radius, vx, vy, color_lp, speed_lp, move_length, 5, true, true);
            this.fireballs.push(ball);
            return ball;
        }
    }

    destroy_fireball(uuid) {
        if (uuid) {
            for (let i = 0; i < this.fireballs.length; i++) {
                let fireball = this.fireballs[i];
                if (fireball.uuid === uuid) {
                    if (fireball.is_elastic) return false;
                    fireball.destroy();
                    break;
                }
            }
        }
    }

    // destroy_fireball_se(uuid) {
    //     for (let i = 0; i < this.fireball_se.length; i++) {
    //         let fireball = this.fireball_se[i];
    //         if (fireball.uuid === uuid) {
    //             fireball.destroy();
    //             break;
    //         }
    //     }
    // }

    // //风雪的缩影(doge)
    // ganyu_R(x, y) {
    //     for (let i = 0; i < 10 + Math.random() * 10; i++) {
    //         let radius = this.playground.height * 0.05 * Math.random() * 0.1;
    //         let angle = Math.PI * 2 * Math.random();
    //         let vx = Math.cos(angle);
    //         let vy = Math.sin(angle);
    //         let color = null;
    //         let ranint = Math.random();
    //         if (ranint <= 0.5) color = "white";
    //         else color = "CornflowerBlue";

    //         let speed = this.playground.height * 0.3 * 5;
    //         let move_length = this.playground.height * 0.2 * Math.random() * 3.5;
    //         new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
    //     }
    // }

    //扩散
    diffusion() {
        //自己扣血
        this.is_attacked(null, 5, true, true);
        if (this.playground.mode == "multi mode" && this.character === "me") {
            this.playground.mps.send_make_diffusion_ball();
        }



        for (let i = 0; i < 22.5; i++) {
            let radius = 0.0075;
            let angle = Math.PI / 11.25 * i;
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let color = 'rgba(255,99,71, 0.6)';
            let speed = 0.05 * 11.25;
            let move_length = this.radius * 5;
            new DiffusionBall(this.playground, this.x, this.y, radius, vx, vy, color, speed, move_length, this, true);
        }

        for (let i = 0; i < 360; i++) {
            let radius = 0.001;
            let angle = Math.PI / 180 * i;
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let color = 'rgba(255,99,71, 0.6)';
            let speed = 0.15 * 11.25;
            let move_length = this.radius * 15;
            new DiffusionBall(this.playground, this.x, this.y, radius, vx, vy, color, speed, move_length, this, false);
        }

        if (this.character === "me") {
            for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
                let obj = AC_GAME_OBJECTS[i];
                if (obj instanceof Player) {
                    let player = obj;
                    if (player != this) {
                        let distance = this.get_dist(this.x, this.y, player.x, player.y);
                        if (distance < this.radius * 5) {
                            let angle = Math.atan2(player.y - this.y, player.x - this.x);
                            player.is_attacked(angle, 10, false, true);
                            if (this.playground.mode === "multi mode") {
                                this.playground.mps.send_attack(player.uuid, player.x, player.y, angle, 10, null);
                            }
                        }
                    }
                } else if (obj instanceof FireBall && obj.player != this) {
                    let distance = this.get_dist(this.x, this.y, obj.x, obj.y);
                    if (distance < this.radius * 10) {
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

    //牵引
    traction() {

        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (player != this) {
                let distance = this.get_dist(this.x, this.y, player.x, player.y);
                if (distance < this.radius * 5) {
                    // if (!player.is_me) {
                    let angle = Math.atan2(this.y - player.y, this.x - player.x);
                    player.damage_x = Math.cos(angle);
                    player.damage_y = Math.sin(angle);
                    player.damage_speed = player.default_damage_speed;
                    if (this.playground.mode === "multi mode") {
                        this.playground.mps.send_update_damage_player(player.uuid, player.damage_x, player.damage_y, player.damage_speed, player.x, player.y);
                    }
                    // } 
                }
            }
        }
    }

    //弹反
    blocked() {
        for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
            let obj = AC_GAME_OBJECTS[i];
            if (obj instanceof FireBall && obj.player != this) {
                let distance = this.get_dist(this.x, this.y, obj.x, obj.y) - obj.radius - this.radius;
                if (distance < this.radius * 1) {
                    let angle = Math.atan2(obj.y - this.y, obj.x - this.x);
                    if (Math.random() > 0.5) angle += Math.random() * 1 / 3 * Math.PI;
                    else angle -= Math.random() * 1 / 3 * Math.PI;

                    let blockee = obj.player;
                    obj.vx = Math.cos(angle);
                    obj.vy = Math.sin(angle);

                    this.damage_speed = this.default_damage_speed * 0.4;
                    this.damage_x = Math.cos(angle - Math.PI);
                    this.damage_y = Math.sin(angle - Math.PI);

                    for (let i = 0; i < 15 + Math.random() * 10; i++) {
                        let radius = obj.radius * 0.2;
                        let fire_angle = angle;
                        if (Math.random() > 0.5) fire_angle += Math.random() * 1 / 6 * Math.PI;
                        else fire_angle -= Math.random() * 1 / 6 * Math.PI;
                        let vx = Math.cos(fire_angle);
                        let vy = Math.sin(fire_angle);
                        let color = obj.color;
                        let speed = 0.15 * 3 * 2.5 + 0.15 * 3 * 2.5 * Math.random();
                        let move_length = this.radius * 10 * Math.random();
                        new Particle(this.playground, obj.x, obj.y, radius, vx, vy, color, speed, move_length);
                    }

                    if (!obj.special_effect) {
                        obj.player = this;
                        obj.color = "CornflowerBlue";
                        obj.move_length = obj.origin_move_length;
                        //scale
                        obj.speed = 0.15 * 3;
                        obj.is_elastic = true;
                        obj.special_effect = true;
                    }

                    if (this.playground.mode === "multi mode") {
                        this.playground.mps.send_block(this.uuid, blockee.uuid, obj.uuid, obj.vx, obj.vy, angle)
                    }
                }
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle, damage, need_write_damage_mode, need_show_particle) {

        if (damage > 0 && this.character != "me") this.need_draw_hp = true, this.draw_hp_ftime = this.spent_time + this.draw_hp_time;

        if (need_show_particle) {
            for (let i = 0; i < 20 + Math.random() * 10; i++) {
                let x = this.x, y = this.y;
                //scalse
                let radius = 0.02 * Math.random() * 0.20;
                let angle = Math.PI * 2 * Math.random();
                let vx = Math.cos(angle);
                let vy = Math.sin(angle);
                let color = this.color;
                //scalse
                let speed = 0.15 * 11.25;
                let move_length = this.radius * Math.random() * 10;
                new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
            }
        }
        //测试位

        /*if(!this.is_me){
            this.radius -= damage;
        }   */

        this.hp -= damage;

        if (this.hp > this.style_three_max_hp && this.hp <= this.style_two_max_hp) {
            this.radius = this.style_two_radius;
            this.speed = this.style_two_speed;
        }
        else if (this.hp > this.style_four_max_hp && this.hp <= this.style_three_max_hp) {
            this.radius = this.style_three_radius;
            this.speed = this.style_three_speed;
        }
        else if (this.hp <= this.style_four_max_hp && this.hp > 0) {
            this.radius = this.style_four_radius;
            this.speed = this.style_four_speed;
        }
        else if (this.hp <= 0) {
            if (this.playground.mode === "multi mode" && this.character === "me") this.playground.mps.send_player_die();
            this.destroy();
            return false;
        }

        if (!need_write_damage_mode) {
            this.damage_x = Math.cos(angle);
            this.damage_y = Math.sin(angle);
            this.damage_speed = this.default_damage_speed;
        }

        /*
    if(!this.is_me){
        this.speed *= 1.5;
    }
    */
    }

    receive_attack(x, y, angle, damage, ball_uuid, attacker) {
        attacker.destroy_fireball(ball_uuid);
        this.x = x;
        this.y = y;
        this.is_attacked(angle, damage, false, true);
    }

    update() {
        this.spent_time += this.timedelta / 1000;
        if (this.playground.mode === "multi mode" && this.spent_time > this.next_update_pos && this.character === "me") {
            this.next_update_pos++;
            this.playground.mps.send_update_player(this.hp, this.x, this.y, this.vx, this.vy, this.damage_x, this.damage_y, this.damage_speed);
        }

        if (this.character === "me") {
            this.update_coldtime();
        }

        if (this.character === "me" && this.playground.focus_player === this) {
            this.playground.re_cx_cy(this.x, this.y);
        }

        this.update_move();
        this.update_win()

        if ((this.playground.mode === "single mode" && this.character === "me") || (this.playground.mode === "multi mode" && this.playground.state === "fighting" && this.character === "me")) {
            this.update_cold_mode();
        }

        //持续性的技能渲染
        // if (this.r_stime != null && this.spent_time < this.r_ftime && (this.spent_time > this.r_next && this.spent_time < this.r_next + this.r_part_time)) {
        //     this.ganyu_R(this.rx, this.ry);
        //     console.log(1);
        // } 
        // else if(this.spent_time >= this.r_next + this.r_part_time){
        //     this.r_next = this.r_next + this.r_part_time + this.r_none;
        //     console.log(2);
        // }
        // else if(this.r_stime != null){
        //     this.r_stime = null;
        //     console.log(3);
        // }

        //e持续
        if (this.e_stime != null && this.spent_time < this.e_ftime) {
            this.blocked();
        } else if (this.e_stime != null) {
            this.e_stime = null;
        }

        this.render();
    }

    update_cold_mode() {
        let warmers = this.playground.warmers;
        let before_is_cold = this.is_cold;
        let before_is_cold_max = this.is_cold_max;
        let flag = true;
        for (let i = 0; i < warmers.length; i++) {
            let dist = this.get_dist(this.x, this.y, warmers[i].x, warmers[i].y);
            if (dist < warmers[i].radius * 3.5) {
                if (before_is_cold) this.next_reduce_code_num = this.spent_time;
                this.is_cold_max = false;
                this.is_cold = false;;
                flag = false;
                break;
            }
        }
        if (flag) this.is_cold = true;

        if (this.is_cold && this.spent_time >= this.next_update_code_num) this.cold_num = Math.min(this.cold_num + 1, 100);
        else if (!this.is_cold && this.spent_time >= this.next_reduce_code_num) this.cold_num = Math.max(0, this.cold_num - 10);

        if (before_is_cold && this.is_cold && this.spent_time >= this.next_update_code_num) this.next_update_code_num++;
        else if (!before_is_cold && this.is_cold) this.next_update_code_num = this.spent_time + 1;
        else if (!before_is_cold && !this.is_cold && this.spent_time >= this.next_reduce_code_num) this.next_reduce_code_num++;


        //寒冷值满时的效果
        if (this.cold_num === 100 && !before_is_cold_max) this.is_cold_max = true, this.next_reduce_hp = this.spent_time;
        if (this.is_cold_max && this.spent_time >= this.next_reduce_hp) {
            this.is_attacked(null, 3, true, false)
            if (this.playground.mode === "multi mode") {
                this.playground.mps.send_hp_decrease(this.uuid, 3);
            }
        };
        if (before_is_cold_max && this.spent_time >= this.next_reduce_hp) this.next_reduce_hp++;
    }

    update_win() {
        if ((this.playground.state === "fighting" && this.playground.players.length === 1 && this.playground.players[0].character === "me") || (this.playground.mode === "single mode" && this.playground.players.length === 1 && this.playground.players[0].character === "me")) {
            this.playground.score_board.win();
        }
    }

    update_coldtime() {
        if (!this.d_can) {
            if (this.spent_time >= this.d_make_time + this.d_cold_time) this.d_can = true;
        }
    }

    update_move() {
        if (this.character === "robot" && this.spent_time > 5 && Math.random() < 1 / 180.0) {
            let player = null;
            //集火逻辑
            if (this.playground.players.length <= 10 && this.playground.players[0].character === "me") {
                player = this.playground.players[0];
            } else if (this.playground.players.length != 1) {
                player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
                while (player === this) {
                    player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
                }
            }


            //player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            if (this.playground.players.length > 1) {
                let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
                let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
                let if_se = Math.random() <= 0.1 ? true : false;
                this.shoot_fireball(tx, ty, if_se);
            }

        }

        //触边反弹逻辑
        //scale
        if (this.x + this.radius >= this.playground.virtual_map_width || this.x - this.radius <= 0) {

            if (this.damage_speed > this.eps) {
                this.damage_x = -this.damage_x;
                this.damage_speed = 1.5;
                this.is_attacked(null, 5, true, true);
            } else {
                this.damage_x = -this.vx;
                this.damage_y = this.vy;
                this.damage_speed = 1.5;
            }
        }

        if (this.y + this.radius >= this.playground.virtual_map_height || this.y - this.radius <= 0) {
            if (this.damage_speed > this.eps) {
                this.damage_y = -this.damage_y;
                this.damage_speed = 1.5;
                this.is_attacked(null, 5, true, true);
            } else {
                this.damage_x = this.vx;
                this.damage_y = -this.vy;
                this.damage_speed = 1.5;
            }
        }

        if (this.damage_speed > this.eps) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (this.character === "robot") {
                    let tx = Math.random() * this.playground.virtual_map_width;
                    let ty = Math.random() * this.playground.virtual_map_height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
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

        if (this.character === "me") {

            //q技能渲染
            if (this.need_draw) {
                this.ctx.beginPath();
                //scale
                this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * 1.3 * scale, 0 - Math.PI / 2, Math.PI * (2 * this.skill_ptime / this.q_cd) - Math.PI / 2);
                this.ctx.lineWidth = 1;

                if (this.skill_ptime < this.q_cd) {
                    this.ctx.strokeStyle = "white";
                } else {
                    this.ctx.strokeStyle = "CornflowerBlue";
                }

                if (this.playground.players[0].character === "me") this.ctx.stroke();
                this.ctx.closePath();
            }

            //e的范围圈
            if (this.e_show_circle) {
                this.ctx.beginPath();
                this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * 1.2 * scale, 0, Math.PI * 2, false);
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                this.ctx.stroke();
                this.ctx.closePath();

                this.ctx.beginPath();
                this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * 1.4 * scale, 0, Math.PI * 2, false);
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                this.ctx.stroke();
                this.ctx.closePath();

                this.ctx.beginPath();
                this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * 1.6 * scale, 0, Math.PI * 2, false);
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                this.ctx.stroke();
                this.ctx.closePath();

                this.ctx.beginPath();
                this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * 1.8 * scale, 0, Math.PI * 2, false);
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                this.ctx.stroke();
                this.ctx.closePath();

                this.ctx.beginPath();
                this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * 2.0 * scale, 0, Math.PI * 2, false);
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                this.ctx.stroke();
                this.ctx.closePath();
            }

            //d范围圈
            if (this.d_show_circle) {
                this.ctx.beginPath();
                this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * 15.0 * scale, 0, Math.PI * 2, false);
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = 'rgba(255, 99, 71, 0.6)';
                this.ctx.stroke();
                this.ctx.closePath();
            }

            //玩家实时渲染
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
            //this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (ctx_x - this.radius) * scale, (ctx_y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();
        } else {
            /*
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();*/
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
            //this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (ctx_x - this.radius) * scale, (ctx_y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();

        }

        //绘制其他人生命值
        if (this.character != "me" && this.draw_hp_ftime != null && this.spent_time <= this.draw_hp_ftime) {

            let hp = this.hp;
            let color = null;
            if (hp > this.style_two_max_hp) color = "white";
            else if (hp > this.style_three_max_hp) color = "NavajoWhite";
            else if (hp > this.style_four_max_hp) color = "LightSalmon";
            else color = "Tomato";
            this.ctx.beginPath();

            this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * 1.3 * scale, (100.0 - hp) / 100 * Math.PI * 2 - Math.PI / 2, Math.PI * 2 - Math.PI / 2);
            this.ctx.lineWidth = 2;

            this.ctx.strokeStyle = color;
            this.ctx.stroke();

            this.ctx.closePath();
        } else if (this.character === "robot" && this.draw_hp_ftime != null) {
            this.draw_hp_ftime = null;
        }

        //绘制玩家生命值
        if (this.playground.players.length > 0 && this.playground.players[0].character === "me") {
            let hp = this.playground.players[0].hp;

            this.ctx.fillStyle = "white";
            this.ctx.font = (this.playground.height * 0.05).toString() + "px Arial";
            this.ctx.fillText("hp: ", this.playground.width * 0.25, this.playground.height * 0.9);

            // this.ctx.font = (this.playground.height * 0.035).toString() + "px Arial";
            // this.ctx.fillText(this.hp.toString() + "%", this.playground.width * 0.48, this.playground.height * 0.88);

            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "white";
            this.ctx.strokeRect(this.playground.width * 0.35, this.playground.height * 0.85, this.playground.width * 0.3, this.playground.height * 0.015);

            this.ctx.fillStyle = 'LightSkyBlue';
            this.ctx.fillRect(this.playground.width * 0.352, this.playground.height * 0.852, this.playground.width * 0.296 * this.playground.players[0].cold_num / 100.0, this.playground.height * 0.01);


            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "white";
            this.ctx.strokeRect(this.playground.width * 0.298, this.playground.height * 0.895, this.playground.width * 0.404, this.playground.height * 0.05);

            let color = null;
            if (hp > this.style_two_max_hp) color = "PaleGreen";
            else if (hp > this.style_three_max_hp) color = "NavajoWhite";
            else if (hp > this.style_four_max_hp) color = "LightSalmon";
            else color = "Tomato";

            this.ctx.fillStyle = color;
            this.ctx.fillRect(this.playground.width * 0.3, this.playground.height * 0.9, this.playground.width * 0.4 * this.playground.players[0].hp / 100.0, this.playground.height * 0.04);
        }
    }

    on_destroy() {
        if (this.character === "me" && (this.playground.mode === "single mode" || this.playground.state === "fighting")) {
            this.playground.score_board.lose();
        }

        if (this.character === "me" && this.playground.mode === "multi mode") {
            this.playground.state = "over";
            this.playground.notice_board.write("Over");
        }

        for (let i = 0; i < this.playground.players.length; i++) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
                break;
            }
        }
    }
}
