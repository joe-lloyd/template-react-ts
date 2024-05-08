import Enemy from "./Enemy.ts";
import { Physics, Scene } from "phaser";
import Character from "./Character.ts";

export class RangedEnemy extends Enemy {
  bullets: Phaser.Physics.Arcade.Group;
  attackRange: number;

  constructor(scene: Scene, x: number, y: number, bullets: Phaser.Physics.Arcade.Group) {
    super(scene, x, y, 0x00FFFF, 150, 50);
    this.bullets = bullets;
    this.attackRange = 200; // Set desired range for shooting

    this.isAttacking = false;
    this.attackCooldown = 0;
  }

  update(delta: number, player: Character, enemies: Character[]) {
    this.applySeparation(enemies);

    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    let direction = new Phaser.Math.Vector2(0, 0);

    // Move towards player if outside attack range
    if (distance > this.attackRange) {
      direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
      this.move(delta, direction);
    }

    // Rotate towards player
    this.sprite.rotation = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y) - Math.PI / 2;

    this.handleRangedAttack(delta, player);
  }

  handleRangedAttack(delta: number, player: Character) {
    if (!this.isAttacking && this.attackCooldown <= 0) {
      this.isAttacking = true;

      // Create a bullet as an ellipse
      const bullet = this.scene.add.ellipse(this.x, this.y, 10, 10, 0x00FFFF);
      this.scene.physics.add.existing(bullet);
      const bulletBody = bullet.body as Physics.Arcade.Body;
      const bulletSpeed = 300;
      const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
      const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)). scale(bulletSpeed);
      bulletBody.setVelocity(velocity.x, velocity.y);

      // Destroy the bullet after 1 second
      this.scene.time.delayedCall(1000, () => {
        bullet.destroy();
      });

      this.isAttacking = false;
      this.attackCooldown = 1000; // Set attack cooldown (1 second)
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
  }
}
