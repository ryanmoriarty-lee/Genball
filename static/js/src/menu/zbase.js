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
