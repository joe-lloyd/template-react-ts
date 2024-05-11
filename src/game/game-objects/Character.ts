import { Physics } from "phaser";
import { Game } from "../scenes/Game.ts";

class Character extends Physics.Arcade.Sprite {
  speed: number;
  color: number;
  scene: Game;

  constructor(scene: Game, x: number, y: number, color: number, speed: number) {
    const width = 32;
    const height = Math.sqrt(3) / 2 * width;

    const graphics = scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillTriangle(width / 2, height, 0, 0, width, 0);
    graphics.generateTexture("triangleTexture", width, height);
    super(scene, x, y, "triangleTexture");
    this.scene = scene;
    this.speed = speed;
    this.color = color; // Initial color
    this.setTint(color); // Set initial tint on the sprite
  }

  addToScene() {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  move(_delta: number, direction: Phaser.Math.Vector2) {
    const velocityX = direction.x * this.speed;
    const velocityY = direction.y * this.speed;
    this.setVelocity(velocityX, velocityY);
  }

  updatePosition() {
    // This method might not be necessary anymore, as position and rendering
    // are handled by the physics engine and the Sprite base class.
  }
}

export default Character;
