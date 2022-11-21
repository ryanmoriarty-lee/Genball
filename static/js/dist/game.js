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
class AcGameMenu {
    constructor(root){
        this.root=root;
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        <img class = "ac-game-menu-op-img ac-game-menu-op-img-single" src = "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/ganyu_hope.png" >
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            天梯模式
        </div>
        <img class = "ac-game-menu-op-img ac-game-menu-op-img-multi" src = "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/ganyu_star.png" >
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            退出
        </div>
        <img class = "ac-game-menu-op-img ac-game-menu-op-img-settings" src = "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/qiqi_lay.jpg" >
    </div>
</div>
`);

        this.$menu.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');
        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        let bgm = document.getElementsByClassName("ac-game-menu-bgm")[0];

        this.$single_mode.click(function(){
            outer.hide();
            outer.root.choose_skin.show("single mode");
            outer.root.choose_skin.change_bgm();
            bgm.src = "";
        });
        this.$multi_mode.click(function(){
            outer.hide();
            outer.root.choose_skin.show("multi mode");
            outer.root.choose_skin.change_bgm();
            bgm.src = "";
        });
        this.$settings.click(function(){
            outer.root.settings.logout_on_remote();
        });
    }


    show(){
        this.$menu.show();
        let bgm = document.getElementsByClassName("ac-game-menu-bgm")[0];
        bgm.src = menu_bgm;
    }

    hide(){
        this.$menu.hide();
    }
}
let AC_GAME_OBJECTS = []


class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false; //是否执行过start函数
        this.timedelta = 0 //当前距离上一帧的时间间隔
        this.uuid = this.create_uuid();
    }

    create_uuid(){
        let res = "";
        for(let i = 0; i < 20; i++) {
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;
    }

    start() { //只会在第一帧执行一次

    }

    update() { //每一帧都会执行一次

    }

    late_update() {

    }

    on_destroy() { //被销毁前执行一次

    }

    destroy() { //删掉该物体
        this.on_destroy();

        for (let i = 0; i < AC_GAME_OBJECTS.length; i ++){
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }

}

let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp) {

    for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++) {
        let obj = AC_GAME_OBJECTS[i];
        obj.late_update();
    }

    last_timestamp = timestamp;


    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);

class ChatField {
    constructor(playground) {
        this.playground = playground;
        this.$history = $(`<div class="ac-game-chat-field-history">历史信息：</div>`);
        this.$input = $(`<input type="text" class = "ac-game-chat-field-input">`);

        this.$history.hide();
        this.$input.hide();

        this.func_id = null;

        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.start();
    }

    start() {
        this.add_listening_events();
        this.resize();
    }

    resize() {
        this.margin_left = (this.playground.$playground.width() - this.playground.width) * 0.6;
        this.history_top = (this.playground.$playground.height() - this.playground.height) / 2 + 0.5 * this.playground.height;
        this.history_height = this.playground.height * 0.33;

        this.input_top = this.history_top + 0.02 * this.playground.height + this.history_height;
        this.width = this.playground.width * 0.15;


        this.$history.css({
            "position": "absolute",
            "left": this.margin_left,
            "top": this.history_top,

            "width": this.width,
            "height": this.history_height,

            "color": "white",
            "font-size": "2vh",

            // "padding": "5vh",
            "overflow": "auto"
        });

        this.$input.css({
            "position": "absolute",
            "left": this.margin_left,
            "top": this.input_top,

            "width": this.width,
            "height": "3vh",

            "color": "white",
            "font-size": "2vh",

            "background-color": "rgba(222,225,230,0.2)"
        });
    }

    add_listening_events() {
        let outer = this;
        this.$input.keydown(function (e) {
            if (e.which === 27) {
                outer.hide_input();
                return false;
            } else if (e.which === 13) {
                let username = outer.playground.root.settings.username;
                let text = outer.$input.val();
                if (text) {
                    outer.$input.val("");
                    outer.add_message(username, text);
                    outer.playground.mps.send_message(username, text);
                }
            }
        })
    }

    render_message(message) {
        return $(`<div>${message}</div>`);
    }

    add_message(username, text) {
        this.show_history();
        let message = `[${username}]：${text}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }

    show_history() {
        let outer = this;
        this.$history.fadeIn();

        if (this.func_id) clearTimeout(this.func_id);

        this.func_id = setTimeout(function () {
            outer.$history.fadeOut();
            outer.func_id = null;
        }, 5000);
    }

    show_input() {
        this.show_history();

        this.$input.show();
        this.$input.focus();
    }

    hide_input() {
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }

}class ColdWarning extends AcGameObject {
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
class Grid extends AcGameObject {
    constructor(playground, ctx, i, j, l, stroke_color) {
        super();
        this.playground = playground;
        this.ctx = ctx;
        this.i = i;
        this.j = j;
        this.l = l;
        this.x = this.i * this.l;
        this.y = this.j * this.l;

        this.stroke_color = stroke_color;
        this.has_grass = false; // 格子上有草否
        this.is_poisoned = false; // 格子是否在毒圈
        this.fill_color = "rgb(210, 222, 238)";

        this.grass_color = "rgb(213, 198, 76)"; // grass yellow
    }

    start() {}

    get_manhattan_dist(x1, y1, x2, y2) {
        return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
    }

    update() {
        this.render();
    }

    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy;
        let cx = ctx_x + this.l * 0.5, cy = ctx_y + this.l * 0.5; // grid的中心坐标
        // 处于屏幕范围外，则不渲染
        if (cx * scale < -0.2 * this.playground.width ||
            cx * scale > 1.2 * this.playground.width ||
            cy * scale < -0.2 * this.playground.height ||
            cy * scale > 1.2 * this.playground.height) {
            return;
        }

        this.render_grid(ctx_x, ctx_y, scale);
        if (this.has_grass) {
            let player = this.playground.players[0];
            if (player.character === "me" && this.get_manhattan_dist(this.x + this.l / 2, this.y + this.l / 2, player.x, player.y) < 1.5 * this.l)
                this.grass_color = "rgba(213, 198, 76, 0.3)";
            else
                this.grass_color = "rgb(213, 198, 76)";
            this.render_grass(ctx_x, ctx_y, scale);
        }
    }

    render_grid(ctx_x, ctx_y, scale) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.l * 0.03 * scale;
        this.ctx.strokeStyle = this.stroke_color;
        this.ctx.rect(ctx_x * scale, ctx_y * scale, this.l * scale, this.l * scale);
        this.ctx.stroke();
        this.ctx.restore();
    }

    render_grass(ctx_x, ctx_y, scale) {
        this.ctx.save();
        this.ctx.beginPath();
        // this.ctx.lineWidth = this.l * 0.03 * scale;
        this.ctx.lineWidth = 0;
        this.ctx.rect(ctx_x * scale, ctx_y * scale, this.l * scale, this.l * scale);
        this.ctx.fillStyle = this.grass_color;
        this.ctx.fill();
        this.ctx.restore();
    }
}class Snow extends AcGameObject {
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

class MiniMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas class="mini-map"></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.bg_color = "rgba(0, 0, 0, 0.3)";
        this.bright_color = "rgba(247, 232, 200, 0.7)";
        this.players = this.playground.players;
        this.warmers = this.playground.warmers;
        this.pos_x = this.playground.width - this.playground.height * 0.3;
        this.pos_y = this.playground.height * 0.7;
        this.width = this.playground.height * 0.3;
        this.height = this.width;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;

        this.playground.$playground.append(this.$canvas);
        this.real_map_width = this.playground.virtual_map_width;

        this.lock = false;
        this.drag = false;
    }

    start() {
        this.add_listening_events();
    }

    resize() {
        this.pos_x = this.playground.width - this.playground.height * 0.3;
        this.pos_y = this.playground.height * 0.7;
        this.width = this.playground.height * 0.3;
        this.height = this.width;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;


        this.margin_right = (this.playground.$playground.width() - this.playground.width) / 2;
        this.margin_bottom = (this.playground.$playground.height() - this.playground.height) / 2;
        this.$canvas.css({
            "position": "absolute",
            "right": this.margin_right,
            "bottom": this.margin_bottom
        });

    }

    add_listening_events() {
        let outer = this;
        this.$canvas.on("contextmenu", function () {
            return false;
        });

        this.$canvas.mousedown(function (e) {
            if (outer.playground.mode === "single mode" || (outer.playground.mode === "multi mode" && outer.playground.state === "fighting")) {

                const rect = outer.ctx.canvas.getBoundingClientRect();
                let ctx_x = e.clientX - rect.left, ctx_y = e.clientY - rect.top; // 小地图上的位置
                let tx = ctx_x / outer.width * outer.playground.virtual_map_width, ty = ctx_y / outer.height * outer.playground.virtual_map_height; // 大地图上的位置

                if (e.which === 1) { // 左键，定位屏幕中心
                    outer.lock = true;
                    outer.drag = false;

                    outer.playground.focus_player = null;
                    outer.playground.re_cx_cy(tx, ty);
                    // (rect_x1, rect_y1)为小地图上框框的左上角的坐标（非相对坐标）
                    outer.rect_x1 = ctx_x - (outer.playground.width / 2 / outer.playground.scale / outer.playground.virtual_map_width) * outer.width;
                    outer.rect_y1 = ctx_y - (outer.playground.height / 2 / outer.playground.scale / outer.playground.virtual_map_height) * outer.height;
                } else if (e.which === 3) { // 右键，移动过去
                    let player = outer.playground.players[0];
                    if (player.character === "me") {
                        player.move_to(tx, ty);
                        if (outer.playground.mode === "multi mode") {
                            outer.playground.mps.send_move_to(tx, ty);
                        }
                    }
                }
            }
            outer.playground.game_map.$canvas.focus();
        });

        this.$canvas.mousemove(function (e) {
            if (outer.playground.mode === "single mode" || (outer.playground.mode === "multi mode" && outer.playground.state === "fighting")) {

                const rect = outer.ctx.canvas.getBoundingClientRect();
                let ctx_x = e.clientX - rect.left, ctx_y = e.clientY - rect.top; // 小地图上的位置
                let tx = ctx_x / outer.width * outer.playground.virtual_map_width, ty = ctx_y / outer.height * outer.playground.virtual_map_height; // 大地图上的位置
                if (e.which === 1) {
                    if (outer.lock) {
                        outer.drag = true;
                        outer.playground.focus_player = null;
                        outer.playground.re_cx_cy(tx, ty);
                        outer.rect_x1 = ctx_x - (outer.playground.width / 2 / outer.playground.scale / outer.playground.virtual_map_width) * outer.width;
                        outer.rect_y1 = ctx_y - (outer.playground.height / 2 / outer.playground.scale / outer.playground.virtual_map_height) * outer.height;
                    }
                }
            }
            outer.playground.game_map.$canvas.focus();
        });

        this.$canvas.mouseup(function (e) {
            if (outer.playground.mode === "single mode" || (outer.playground.mode === "multi mode" && outer.playground.state === "fighting")) {
                if (outer.lock) outer.lock = false;
            }
            outer.playground.game_map.$canvas.focus();
        });
    }

    update() {
        this.render();
    }

    render() {
        let scale = this.playground.scale;
        this.ctx.clearRect(0, 0, this.width, this.height); // 不加这行的话小地图背景会变黑
        this.ctx.fillStyle = this.bg_color;
        this.ctx.fillRect(0, 0, this.width, this.height);
        if (this.playground.focus_player) {
            this.rect_x1 = (this.playground.focus_player.x - this.playground.width / 2 / scale) / this.real_map_width * this.width;
            this.rect_y1 = (this.playground.focus_player.y - this.playground.height / 2 / scale) / this.real_map_width * this.height;
        }
        let w = this.playground.width / scale / this.real_map_width * this.width;
        let h = this.playground.height / scale / this.real_map_width * this.height;
        this.ctx.save();
        this.ctx.strokeStyle = this.bright_color;
        this.ctx.setLineDash([15, 5]);
        this.ctx.lineWidth = Math.ceil(3 * scale / 1080);

        this.rect_x1 = Math.min(this.rect_x1, this.width - w);
        this.rect_x1 = Math.max(this.rect_x1, 0);

        this.rect_y1 = Math.min(this.rect_y1, this.height - h);
        this.rect_y1 = Math.max(this.rect_y1, 0);


        this.ctx.strokeRect(this.rect_x1, this.rect_y1, w, h);
        this.ctx.restore();
        for (let i = 0; i < this.players.length; i++) {
            let obj = this.players[i];
            let x = obj.x / this.real_map_width * this.width, y = obj.y / this.real_map_width * this.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.width * 0.025, 0, Math.PI * 2, false);
            this.ctx.fillStyle = obj.color;
            this.ctx.fill();
        }

        for (let i = 0; i < this.warmers.length; i++) {
            let obj = this.warmers[i];
            let x = obj.x / this.real_map_width * this.width, y = obj.y / this.real_map_width * this.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.width * 0.025, 0, Math.PI * 2, false); 
            this.ctx.fillStyle = 'rgba(255,99,71,0.7)';
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(x, y, this.width * 0.075, 0, Math.PI * 2, false); 
            this.ctx.lineWidth = 0.8;

            this.ctx.strokeStyle = 'rgba(255,99,71,0.5)';
            this.ctx.stroke();
            this.ctx.closePath();

        }
    }

}class NoticeBoard extends AcGameObject{
    constructor(playground) {
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.text = "已就绪：0人";
    }

    start() {

    }

    write(text) {
        this.text = text;
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.playground.width / 2, 20);
    }
}class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
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
        this.friction = 0.9;
        this.eps = 0.01;
    }

    start() {
    }

    update() {
        if(this.move_length < this.eps || this.speed < this.eps) {
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
}class DiffusionBall extends AcGameObject {
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
class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        this.hide();
        this.root.$ac_game.append(this.$playground);
        this.start();

    }


    get_random_color() {
        let color = ["LightSkyBlue", "cyan", "pink", "Moccasin", "PaleGreen", "Violet", "Tomato", "Silver"];
        return color[Math.floor(Math.random() * color.length)];
    }


    get_random_enemys() {
        return enemys[Math.floor(Math.random() * enemys.length)];
    }

    create_uuid() {
        let res = "";
        for (let i = 0; i < 20; i++) {
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;
    }

    start() {
        let outer = this;
        let uuid = this.create_uuid();
        $(window).on(`resize.${uuid}`, function () {
            // console.log('resize');
            outer.resize();
        });

        if (this.root.AcWingOS) {
            this.root.AcWingOS.api.window.on_close(function() {
                $(window).off(`resize.${uuid}`);
            });
        }
    }


    resize() {
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        if (this.game_map) this.game_map.resize();
        if (this.mini_map) this.mini_map.resize();
        if (this.chat_field) this.chat_field.resize();
    }

    re_cx_cy(x, y) {
        this.cx = Math.max(x - 0.5 * this.width / this.scale, 0);
        this.cx = Math.min(this.cx, this.virtual_map_width - this.width / this.scale);
        this.cy = Math.max(y - 0.5 * this.height / this.scale, 0);
        this.cy = Math.min(this.cy, this.virtual_map_height - 1);
    }


    show(mode, sure_skin) {
        let outer = this;
        this.$playground.show();

        //需要创建的基础类
        this.virtual_map_width = 4;
        this.virtual_map_height = this.virtual_map_width;
        this.game_map = new GameMap(this);
        this.game_music = new GameMusic(this);
        this.cold_warning = new ColdWarning(this);
        this.mode = mode;
        this.score_board = new ScoreBoard(this);


        this.multi_bgm = false;

        this.resize();

        //需要存的对象数组
        this.players = [];
        this.fireballs = [];
        this.warmers = [];
        this.snows = [];

        //暖源
        this.warmers.push(new Warmer(this, this.virtual_map_width * 0.1, this.virtual_map_height * 0.1, 0.1));
        this.warmers.push(new Warmer(this, this.virtual_map_width * 0.9, this.virtual_map_height * 0.1, 0.1));
        this.warmers.push(new Warmer(this, this.virtual_map_width * 0.1, this.virtual_map_height * 0.9, 0.1));
        this.warmers.push(new Warmer(this, this.virtual_map_width * 0.9, this.virtual_map_height * 0.9, 0.1));
        this.warmers.push(new Warmer(this, this.virtual_map_width * 0.5, this.virtual_map_height * 0.5, 0.1));



        let player_x = Math.random() * this.virtual_map_width;
        while (player_x + 0.05 >= this.virtual_map_width || player_x - 0.05 <= 0) player_x = Math.random() * this.virtual_map_width;
        let player_y = Math.random() * this.virtual_map_height;
        while (player_y + 0.05 >= this.virtual_map_height || player_y - 0.05 <= 0) player_y = Math.random() * this.virtual_map_height;
        this.players.push(new Player(this, player_x, player_y, 0.05, "white", 0.15, "me", this.root.settings.username, sure_skin));

        //玩家被创建后需要的修改
        this.re_cx_cy(this.players[0].x, this.players[0].y);
        this.focus_player = this.players[0];


        if (mode === "single mode") {
            for (let i = 0; i < 45; i++) {
                let px = Math.random() * this.virtual_map_width, py = Math.random() * this.virtual_map_height;
                this.players.push(new Player(this, px, py, 0.05, this.get_random_color(), 0.15, "robot", 0));
            }
        } else if (mode === "multi mode") {
            this.chat_field = new ChatField(this);
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;
            this.notice_board = new NoticeBoard(this);
            this.player_count = 0;
            this.state = "waiting"; //开始状态

            this.mps.ws.onopen = function () {
                outer.mps.send_create_player(outer.root.settings.username, sure_skin, player_x, player_y);
            };
        }

        this.mini_map = new MiniMap(this);
        this.mini_map.resize();
    }

    hide() {
        while (this.players && this.players.length > 0) {
            while(this.players[0].fireballs && this.players[0].fireballs.length > 0) {
                this.players[0].fireballs[0].destroy();
            }
            this.players[0].destroy();
        }

        while (this.warmers && this.warmers.length > 0) {
            this.warmers[0].destroy();
            this.warmers.splice(0, 1);
        }

        if(this.notice_board) {
            this.notice_board.destroy();
            this.notice_board = null;
        }

        if(this.score_board) {
            this.score_board.destroy();
            this.score_board = null;
        }

        if(this.mini_map) {
            this.mini_map.destroy();
            this.mini_map = null;
        }

        if (this.game_map) {
            this.game_map.destroy();
            this.game_map = null;
        }

        this.$playground.empty();

        this.$playground.hide();
    }


}
class GameMusic {
    constructor(playground) {
        this.playground = playground;
        this.$bgm = $(`<audio class="ac-game-playground-bgm" src="" autoplay='autoplay' loop='loop'></audio>`);
        this.playground.$playground.append(this.$bgm);

        let bgm = document.getElementsByClassName("ac-game-playground-bgm")[0];


        /*if(sure_skin === 1) {
            bgm.src = "https://www.genball.cn/static/audio/playground/ayaka.mp3";
        } else if(sure_skin === 2) {
            bgm.src = "https://www.genball.cn/static/audio/playground/childe.mp3";
        } else if(sure_skin === 3) {
            bgm.src = "https://www.genball.cn/static/audio/playground/hutao.mp3";
        } else if(sure_skin === 4) {
            bgm.src = "https://www.genball.cn/static/audio/playground/kelee.mp3";
        } else if(sure_skin === 5) {
            bgm.src = "https://www.genball.cn/static/audio/playground/keqing.mp3";
        } else if(sure_skin === 6 ) {
            bgm.src = "https://www.genball.cn/static/audio/playground/raidenshogun.mp3";
        } else if(sure_skin === 7) {
            bgm.src = "https://www.genball.cn/static/audio/playground/kokomi.mp3"
        } else if(sure_skin === 8) {
            bgm.src = "https://www.genball.cn/static/audio/playground/windy.mp3";
        } else if(sure_skin === 9) {
            bgm.src = "https://www.genball.cn/static/audio/playground/xiao.mp3"
        } else if(sure_skin === 10) {
            bgm.src = "https://www.genball.cn/static/audio/playground/zhongli.mp3"
        }*/
    

    }
    show() {
        this.$bgm.show();
    }
    hide() {
        this.$bgm.hide();
    }
    stop() {
        this.$bgm.stop();
    }
}

class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if (this.root.AcWingOS) this.platform = "ACAPP";
        this.username = "";
        this.photo = "";

        this.$settings = $(
            `<div class="ac-game-settings">
    <div class = "ac-game-settings-login">
        <div class = "ac-game-settings-title">
            Login
        </div>
        <div class = "ac-game-settings-username">
            <div class = "ac-game-settings-item">
                <input type ="text" placeholder = "用户名">
            </div>
        </div>
        <div class = "ac-game-settings-password">
            <div class = "ac-game-settings-item">
                <input type ="password" placeholder = "密码">
            </div>
        </div>

        <div class = "ac-game-settings-submit">
            <div class = "ac-game-settings-item">
                <button>登录</botton>
            </div>
        </div>

        <div class = "ac-game-settings-error-message">
        </div>

        <div class = "ac-game-settings-option">
            注册
        </div>
        <br>
        <div class = "ac-game-settings-logo">
            <image width="40" src="https://git.acwing.com/RyanMoriarty/homework/-/raw/master/ganyu.png">
            
            <div>
                CoCo Goat一键登录
            </div>
        </div>
    </div>

    <div class = "ac-game-settings-register">
        <div class="ac-game-settings-title">
            注册
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            登录
        </div>
        <br>
        <div class="ac-game-settings-logo">
            <image width="40" src="https://git.acwing.com/RyanMoriarty/homework/-/raw/master/ganyu.png">
            <div>
                CoCo Goat一键登录
            </div>
        </div>
    </div>
    
</div>
`);
        this.$login = this.$settings.find(".ac-game-settings-login");

        this.$login_username = this.$login.find(".ac-game-settings-username input");

        this.$login_password = this.$login.find(".ac-game-settings-password input");

        this.$login_submit = this.$login.find(".ac-game-settings-submit button");

        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");

        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");

        this.$register_password = this.$register.find(".ac-game-settings-password-first input");

        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");

        this.$register_submit = this.$register.find(".ac-game-settings-submit button");

        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");

        this.$register_login = this.$register.find(".ac-game-settings-option");

        this.$register.hide();

        this.$coco_goat_login = this.$settings.find(".ac-game-settings-logo img");


        this.root.$ac_game.append(this.$settings);

        this.start();
    }

    start() {
        if (this.platform === "ACAPP") {
            this.getinfo_acapp();
        } else {
            this.getinfo_web();
            this.add_listening_events();
        }
    }

    add_listening_events() {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();
        this.$coco_goat_login.click(function () {
            outer.coco_goat_login();
        });
    }

    coco_goat_login() {
        $.ajax({
            url: "https://www.genball.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success: function (resp) {
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    add_listening_events_login() {
        let outer = this;

        this.$login_register.click(function () {
            outer.register();
        });

        this.$login_submit.click(function () {
            outer.login_on_remote();
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function () {
            outer.login();
        });
        this.$register_submit.click(function () {
            outer.register_on_remote();
        });
    }

    login_on_remote() {
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: "https://www.genball.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function (resp) {
                if (resp.result === "success") {
                    location.reload();
                } else {
                    outer.$login_error_message.html(resp.result);
                }
            }
        });

    }

    register_on_remote() {
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://www.genball.cn/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function (resp) {
                if (resp.result === "success") {
                    location.reload();
                } else {
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote() {
        if (this.platform === "ACAPP") {
            this.root.AcWingOS.api.window.close();
        } else {
            $.ajax({
                url: "https://www.genball.cn/settings/logout/",
                type: "GET",
                success: function (resp) {
                    if (resp.result === "success") {
                        location.reload();
                    }
                }
            });
        }
    }

    register() {
        this.$login.hide();
        this.$register.show();
    }

    login() {
        this.$register.hide();
        this.$login.show();
    }

    acapp_login(appid, redirect_uri, scope, state) {
        let outer = this;

        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function (resp) {
            if (resp.result === "success") {
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();
                outer.root.menu.show();
            }
        });
    }


    getinfo_acapp() {
        let outer = this;
        $.ajax({
            url: "https://www.genball.cn/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function (resp) {
                if (resp.result === "success") {
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });
    }

    getinfo_web() {
        let outer = this;
        $.ajax({
            url: "https://www.genball.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function (resp) {
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                }
            }
        });
    }

    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }
}
export class AcGame{
    constructor(id, AcWingOS){
        this.id=id;
        this.$ac_game = $('#' + id);
        this.AcWingOS = AcWingOS;
        this.choose_skin = new ChooseSkin(this);
        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start(){
        for(let i = 0; i < meme.length; i++) {
            let img = new Image();
            img.src = meme[i];
            imgs.push(img);
        }
        
        for(let i = 0; i < enemys.length; i++){
            let img = new Image();
            img.src = enemys[i];
            imgs.push(img);
        }
    }
}

 let meme = [
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/utils/wenhao.png",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/ayaka.png",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/ganyu.jpg",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/hutao.png",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/kelee.png",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/zhongli.png",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/abeiduo.jpg", 
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/jean.jpg",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/eula.png",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/xiaogong.jpg",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/wanye.jpg",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/keqing.jpg",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/raidenshogu.png",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/sangonomiya.png",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/windy.png",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/xiao.png",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/childe.png", 
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/mona.jpg",
     "https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genshin_meme/qiqi.jpg"
    ];

let imgs = [];

let skin_name = ["随机皮肤","爱妻绫华","椰奶肥羊","嗷~嗷~","炸鱼禁闭","白吃白喝","天坑硕导","福报民工","记仇真君","军火贩子","枫原万叶",
"牛杂将军","煮饭宅女","藤原心海","哎嘿摸鱼","劲腰裸舞","达达利鸭","算命真香","椰~椰奶"];

let enemys = [
"https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genmo/QQ_flight.jpg",
"https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genmo/QQ_lay.png",
"https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genmo/QQ_mail.jpg",
"https://git.acwing.com/RyanMoriarty/homework/-/raw/master/genmo/QQ_people.jpg",
]

let music_src = [
"",
"https://www.genball.cn/static/audio/playground/ayaka.mp3",
"https://www.genball.cn/static/audio/playground/ganyu.mp3",
"https://www.genball.cn/static/audio/playground/hutao.mp3",
"https://www.genball.cn/static/audio/playground/kelee.mp3",
"https://www.genball.cn/static/audio/playground/zhongli.mp3",
"https://www.genball.cn/static/audio/playground/abeiduo.mp3",
"https://www.genball.cn/static/audio/playground/jean.mp3",
"https://www.genball.cn/static/audio/playground/eula.mp3",
"https://www.genball.cn/static/audio/playground/xiaogong.mp3",
"https://www.genball.cn/static/audio/playground/wanye.mp3",
"https://www.genball.cn/static/audio/playground/keqing.mp3",
"https://www.genball.cn/static/audio/playground/raidenshogun.mp3",
"https://www.genball.cn/static/audio/playground/kokomi.mp3",
"https://www.genball.cn/static/audio/playground/windy.mp3",
"https://www.genball.cn/static/audio/playground/xiao.mp3",
"https://www.genball.cn/static/audio/playground/childe.mp3",
"https://www.genball.cn/static/audio/playground/mona.mp3",
"https://www.genball.cn/static/audio/playground/qiqi.mp3",
]

let choose_skin_bgm = [
"",
"https://www.genball.cn/static/audio/choose_skin/ayaka.mp3",
"https://www.genball.cn/static/audio/choose_skin/ganyu.mp3",
"https://www.genball.cn/static/audio/choose_skin/hutao.mp3",
"https://www.genball.cn/static/audio/choose_skin/kelee.mp3",
"https://www.genball.cn/static/audio/choose_skin/zhongli.mp3",
"https://www.genball.cn/static/audio/choose_skin/abeiduo.mp3",
"https://www.genball.cn/static/audio/choose_skin/jean.mp3",
"https://www.genball.cn/static/audio/choose_skin/eula.mp3",
"https://www.genball.cn/static/audio/choose_skin/xiaogong.mp3",
"https://www.genball.cn/static/audio/choose_skin/wanye.mp3",
"https://www.genball.cn/static/audio/choose_skin/keqing.mp3",
"https://www.genball.cn/static/audio/choose_skin/raidenshogun.mp3",
"https://www.genball.cn/static/audio/choose_skin/kokomi.mp3",
"https://www.genball.cn/static/audio/choose_skin/windy.mp3",
"https://www.genball.cn/static/audio/choose_skin/xiao.mp3",
"https://www.genball.cn/static/audio/choose_skin/childe.mp3",
"https://www.genball.cn/static/audio/choose_skin/mona.mp3",
"https://www.genball.cn/static/audio/choose_skin/qiqi.mp3",
]


let multi_bgm = "https://www.genball.cn/static/audio/playground/multi.mp3"
let menu_bgm = "https://www.genball.cn/static/audio/menu/menu.mp3";
