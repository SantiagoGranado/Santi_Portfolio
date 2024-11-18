import Player from "../component/Player.js";
import Scene from "../engine/Scene.js";

export default class MainScene extends Scene
{
    constructor()
    {
        super('MainScene');
    }

    preload()
    {
        this.load.image('background', 'assets/background.png');
        this.load.image('player', 'assets/player.png');
    }
    
    create()
    {
        this.add.image(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, 'background');

        // Player
        this.player = new Player(this, 400, 300, 'player').setScale(2);
        this.player.setCollideWorldBounds(true);
    }
}