import { GameObjects, Scene } from "phaser";

class Character {
  sprite: GameObjects.Graphics;
  x: number;
  y: number;
  scene: Scene;
  speed: number;

  constructor(scene: Scene, x: number, y: number, color: number, speed: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = scene.add.graphics({ fillStyle: { color } });
    this.updatePosition(x, y);
  }

  updatePosition(x: number, y: number) {
    this.sprite.clear();
    this.sprite.fillTriangle(-16, -16, 0, 16, 16, -16);
    this.sprite.setPosition(x, y);
  }

  move(delta: number, direction: Phaser.Math.Vector2) {
    this.x += direction.x * this.speed * (delta / this.scene.physics.world.timeScale) / 1000;
    this.y += direction.y * this.speed * (delta / this.scene.physics.world.timeScale) / 1000;
    this.updatePosition(this.x, this.y);
  }
}

export default Character;
