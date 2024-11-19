export default class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, name)
    {
        super(scene, x, y, name);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.cursor = this.scene.input.keyboard.createCursorKeys();
    }
}