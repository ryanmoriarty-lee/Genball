**一个Genball的源码小屋，喜欢的小伙伴欢迎来看看，如果可以的话顺便`慷慨地给一颗小星星哟QwQ`，感激不尽**

**`前排提示`**

**本demo所有素材收集自互联网公开资源，并已标明出处，转载利用素材者请根据出处相关要求进行使用**

**`音乐版权归：陈致逸 / HOYO-MiX所有`**
**`皮肤插图版权归画师：__QuAn_所有`**
**`语音版权归：上海米哈游天命科技有限公司所有`**


##         操作方式：

* **`鼠标右键：移动`**
* **`短按q：普通子弹`**
* **`长按q蓄力：弹性霰弹`**
* **`e：弹反`**
* **`d：范围扩散`**
* **`f：范围牵引`**
* **`enter：问候家人`**
* **`esc：关闭聊天窗口`**
* **`鼠标右键点击小地图：移动`**
* **`鼠标左键点击小地图：视角切换`**
* **`空格：视角回归自身`**
* **有关更多相关机制的详情，建议在游玩前阅读最新版本的更新记录**


##         皮肤与音乐：

* **`目前已加入了原神大多数五星角色的皮肤，以及对应的bgm，已达到更好的游玩体验`**


##         地图机制：

* **`目前已加入了雪天地图，同时加入了暖源，寒冷值的设定，以及寒冷值达临界值时的预警`**
* **`寒冷值：在暖源覆盖范围外活动都将积攒寒冷值，当寒冷值积攒到70%时，屏幕将出现预警，100%时持续扣除血量`**


*  **V0版本改动：修复了玩家死亡可发射子弹的bug**
*  **V1版本改动：将颜色整体调为泛白色彩，使得视觉效果更柔和**
*  **V2版本改动：`速度与体积成反比`，`子弹速度与球体速度成正比`，增加了翻盘概率**
*  **V3版本改动：初始球体数量增加为50个**
*  **V4版本改动：当场上球体数量小于10时，在玩家去世前ai的子弹只能命中玩家**
*  **V5版本改动：当场上球体小于5时，ai将集火玩家**
*  **V6版本改动：增加了`鼠标右键点击`时产生粒子效果，便于定位**

*  **V7版本改动：增加了w键位新技能`“扩散”`，使用将消耗等量于一颗子弹伤害的血量，可使自身5倍半径内的敌人受到等价于一颗子弹的伤害，并将其推开一段距离**

*  **V8版本改动：增加了c键位新技能`“牵引”`，可以将`5倍半径内`球体往以施法者为中心的方向吸引一段距离，被吸引的球体速度`将提高提升至1.5倍（至多按此法提高两次）`，若被吸引的是玩家，则玩家会受到等价于一颗子弹的伤害（此技能有小概率由ai释放，且不会对其他ai造成伤害），强化了`“扩散”`的作用范围，提高至玩家`半径的10倍`。修改了ai子弹的判定机制，目前当场上球体数量`小于15`时，ai在玩家去世前将`不会命中其他ai`。鉴于极大影响游戏平衡性，`删除了内测技能“闪现”`** 

*  **V9版本改动：增加了`bgm：Loonboon - Laura Shigihara`（坚果保龄球。。咳咳，很应景嘛，毕竟都是球QwQ）**
*  **V10版本改动：感谢来自 `Mallknow` 大佬的提醒，修复了ai会把自己看做敌人攻击和场上只剩下一个ai时出现卡死的bug，同时进一步加强技能“扩散”，可直接摧毁范围内的所有子弹**

*  **V11版本改动：鉴于部分玩家反馈，游戏体验过于简单，已按要求提高些许难度（感谢反馈）。由于经过V10版本改动后，`躲在屏幕边缘处沿对角线方向无限输出，通过走位等待ai自相残杀`的麻瓜打法过于强势，现将二三阶段的时间前移：当场上球体`数量小于20`时，在玩家去世前ai的子弹只能命中玩家，当场上球体`数量小于10`时，在玩家去世前ai的子弹只能命中玩家。优化键位手感，将技能`“牵引”`的键位调整为f。**

*  **感谢来自`Yeahhh`大佬的提点，修改了AcAPP端无法播放bgm的bug**
*  **V12版本改动：增加了全员皮肤`（用户皮肤为：椰奶肥羊：甘甘甘甘~雨）`，死亡背景和死亡bgm。增加了用户登录和用户注册界面。由于资源加载过多，可能会造成一定的卡顿，可以选择在成功加载资源一次过后，刷新再进入QwQ，带来不便十分抱歉**

*  **V13版本改动：增加了开局前`自选皮肤`的界面，并将ai的图标统一换成QQ人的样式，修改了背景颜色和死亡转场动画。优化了加载方式，`不再出现以往加载异常卡顿的情况`。`增加了每款皮肤对应的bgm`，让玩家使用不同皮肤进行游戏时有别样的体验。增加了`ico`，补充了web端的网页`title`。**

*  **V14版本改动：更换了原皮肤插画，加入`更多皮肤`，优化了部分ui，在皮肤选择页面加入`对应语音和bgm（便于提前预览游戏内的bgm）`，加入菜单界面bgm。加入了~~`CoCo Goat`~~(AcWing)`一键登录`。技能释放改为`快捷施法`，从此脱离鼠标左键，解放食指。q技能修改为`长短按切换模式`，短按q键为发射子弹，`长按蓄力`后则替换为远距离`霰弹`（具弹性（参考了`Andrew1729大佬`关于弹性球的设定），且当攻击到敌人时，move_length属性将刷新）。增添了e键位的`弹反`技能（普通子弹弹反后将`转换为霰弹`，并更换子弹的`发射者`，霰弹弹反后`仅改变方向`）。增加了球体`触边反弹`机制，不再出现跑到屏幕外的问题，若触边反弹时玩家正`因受伤而失去控制`，则将受到`一定量的伤害`。`重新建立数值体系`，加入了生命值条。`扩散`和`牵引`的键位调整为`d`,`f`**

*  **参考了`Andrew1729大佬`关于线圈进度条的设计模式**

*  **参考了`zyitst大佬`关于大小地图的设计模式** 

*  **V15版本改动：增加了1v1的实时`天梯模式`，修改了部分天梯模式内同步方面的bug，增加了`大小地图`的设计，减缓游戏节奏，提高游玩体验。鉴于的地图的扩大，取消`随着血量变少体积变小`的设定。为了减小因大地图相对移动而造成的`受击动画过于僵硬`的影响，`减小了受击后的摩擦力`。`开局位置随机`，天梯模式自动同步开局时不同玩家的位置（如果后续有中途入场的机制，考虑加入同步场上子弹的位置）。删除了天梯模式中部分不必要的同步机制。增加了天梯模式中`问候家人`的功能。**


*  **V16版本改动：增加了子弹发射时的`后坐力`（当然该后坐力可以有多种玩法，比如取消受伤时的僵直状态，实现快速移动等，更多玩法期待玩家去发掘）。时装了`天气系统`（目前仅有下雪的设定），增加了`寒冷值`的设定，当玩家远离暖源或在远离暖源处释放技能时，寒冷值将进行积累，当`寒冷时值积累满`时，玩家将`每秒受到一定数额的伤害`（后续将添加寒冷值的预警特效）。当玩家靠近暖源时，玩家的寒冷值将`迅速下降`。修改了`弹反`的持续时间，由原来的0.1秒上调到0.2秒。**


*  **V17版本改动（待定）：`更换menu的封面，改用js渲染`（目前来看gif图作为封面的效果似乎有点emm。。。），（目前的数值系统不平衡，问题也多），`在加入新技能和新的操作方式后增加cd显示和技能图标`（会标明出处的，咳咳。。），更新类似`女士`/`若陀龙王`一样的BOSS（如果能做的话）**
*  **近期事情较多，如果挖坑来不及填上，请见谅QwQ，如果遇到游戏无法正常加载的问题，可能是在施工，请耐心等待。**

*  `web端地址：`
   https://www.genball.cn


** PS：其实 [这首曲子: La Signora Battle Theme](https://www.bilibili.com/video/BV18Q4y117yQ) 可好了，可惜有点长，目前游戏节奏有点快，无论怎么加都很突兀QwQ，唉，真可惜~（梦想有一天也能用上一首陈致逸老师的曲子）**


[纪念一波爱妻绫华 ：](https://www.bilibili.com/video/BV1rw41197dY?from=search&seid=5644157782874491770&spm_id_from=333.337.0.0)
 ![Image](https://git.acwing.com/RyanMoriarty/homework/-/raw/master/QQ%E5%9B%BE%E7%89%8720210805214201.jpg)
[纪念曲 ：Kitsune's Mask 悠远的关怀](https://music.163.com/#/song?id=1879098369)
