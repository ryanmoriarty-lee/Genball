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

}