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
