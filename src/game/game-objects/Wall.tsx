import { Scene, Physics } from "phaser";

export class Wall extends Physics.Arcade.Sprite {
  constructor(scene: Scene, x: number, y: number, width: number, height: number, color: number) {
    super(scene, x + width / 2, y + height / 2, "wall");
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setDisplaySize(width, height);
    this.refreshBody();

    const graphics = scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRect(x, y, width, height);

    // Uncomment the following lines to display the wall's coordinates
    // const textStyle = { font: "12px Arial", fill: "#ffffff" };
    // scene.add.text(x, y, `(${x}, ${y})`, textStyle);
  }
}
