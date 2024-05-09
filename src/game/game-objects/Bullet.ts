// Bullet.ts
import { Scene, Physics, GameObjects } from 'phaser';

export class Bullet extends GameObjects.Ellipse {
  body: Physics.Arcade.Body;
  friendly: boolean;

  constructor(scene: Scene, x: number, y: number, friendly = false) {
    super(scene, x, y, 10, 10, 0x00FFFF);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body = this.body as Physics.Arcade.Body;
    this.friendly = friendly;
  }

  fire(x: number, y: number, angle: number, speed: number): void {
    this.setPosition(x, y);
    this.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  turnFriendly(): void {
    this.friendly = true;
    this.setFillStyle(0xFF0000); // Change color to red to indicate danger to enemies
  }
}
