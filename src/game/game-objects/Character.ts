import { GameObjects } from "phaser";
import { Game } from "../scenes/Game.ts";

class Character {
  sprite: GameObjects.Graphics;
  x: number;
  y: number;
  scene: Game;
  speed: number;
  color: number;  // Store current color

  constructor(scene: Game, x: number, y: number, color: number, speed: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.color = color; // Initial color
    this.sprite = scene.add.graphics({ fillStyle: { color: this.color } });
    this.updatePosition(x, y);
  }

  updatePosition(x: number, y: number) {
    this.sprite.clear();
    this.sprite.fillStyle(this.color, 1);  // Use the current color
    this.sprite.fillTriangle(-16, -16, 0, 16, 16, -16);
    this.sprite.setPosition(x, y);
  }

  move(delta: number, direction: Phaser.Math.Vector2) {
    this.x += direction.x * this.speed * (delta / this.scene.physics.world.timeScale) / 1000;
    this.y += direction.y * this.speed * (delta / this.scene.physics.world.timeScale) / 1000;
    this.updatePosition(this.x, this.y);
  }

  setTint(color: number) {
    this.color = color; // Update the color used for the fill style
    this.updatePosition(this.x, this.y); // Update graphics to apply new color
  }
}

export default Character;
