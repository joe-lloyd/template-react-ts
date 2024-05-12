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

  move(delta: number, direction: Phaser.Math.Vector2) {
    // Convert delta from milliseconds to seconds
    const scaledDelta = (delta / 1000)// * this.scene.physics.world.timeScale;

    // Apply the direction and speed scaled by the adjusted delta
    // Assuming 'speed' units are in pixels per second, compute pixels per frame
    const velocityX = direction.x * this.speed * scaledDelta;
    const velocityY = direction.y * this.speed * scaledDelta;

    console.log(`Speed: ${this.speed}, Delta: ${delta}, Scaled Delta: ${scaledDelta}, Velocity X: ${velocityX}, Velocity Y: ${velocityY}`);

    // Set the computed velocities
    this.setVelocity(velocityX, velocityY);
  }
}

export default Character;
