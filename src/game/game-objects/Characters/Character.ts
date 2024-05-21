import { Physics } from "phaser";
import { GameLevel1 } from "../../scenes/GameLevel1.ts";

class Character extends Physics.Arcade.Sprite {
  speed: number;
  color: number;
  scene: GameLevel1;

  constructor(scene: GameLevel1, x: number, y: number, color: number, speed: number) {
    const width = 32;
    const height = Math.sqrt(3) / 2 * width;

    const graphics = scene.add.graphics();
    const textureName = `triangleTexture-${color}`;
    graphics.fillStyle(color, 1);
    graphics.fillTriangle(width / 2, height, 0, 0, width, 0);
    graphics.generateTexture(textureName, width, height);
    super(scene, x, y, textureName);
    this.scene = scene;
    this.speed = speed;
    this.color = color;
  }

  addToScene() {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.add.collider(this, this.scene.walls);
  }

  handleMove(delta: number, direction: Phaser.Math.Vector2) {
    const scaledDelta = (delta / this.scene.physics.world.timeScale) / 1000;
    this.x += direction.x * this.speed * scaledDelta;
    this.y += direction.y * this.speed * scaledDelta;
  }

  update(_time: number, delta: number) {
    super.update(_time, delta);
  }
}

export default Character;
