class ControlGame{
    constructor(root){
        this.root = root;
        this.$control_game = $(`
<div class="ac-game-control-game">
        <div class="ac-game-control-game-restart">restart</div>
</div>
`);
        this.$restart_mode = this.$control_game.find('.ac-game-control-game-restart');
        this.root.$ac_game.append(this.$control_game);

        this.start();
        this.hide();
    }


    start() {
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$restart_mode.click(function(){
            console.log(666);
            outer.hide();

            outer.root.playground.hide();
            
            let game = document.getElementById("ac_game_12345678");
            let pg = document.getElementsByClassName("ac-game-playground")[0];
            let ck = document.getElementsByClassName("ac-game-choose-skin")[0];

            game.removeChild(pg);
            game.removeChild(ck);

            outer.root.choose_skin = new ChooseSkin(outer.root);
            outer.root.playground = new AcGamePlayground(outer.root);

            outer.root.choose_skin.show();
            sure_skin = -1;
        });
    }




    show() {
        this.$control_game.show()
    }

    hide() {
        this.$control_game.hide()
    }
}
