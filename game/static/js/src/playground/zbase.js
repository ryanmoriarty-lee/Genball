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
