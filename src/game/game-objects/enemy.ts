import Character from "./character";
import { Scene } from "phaser";

class MeleeEnemy extends Character {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 0xFF00FF); // Pink color
  }

  update(delta: number, player: Character) {
    const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
    this.move(delta, direction);
    this.handleMeleeAttack(delta, 0xFF00FF, 40); // Pink triangle
  }
}

class RangedEnemy extends Character {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 0x00FFFF); // Cyan color
  }

  update(delta: number, player: Character) {
    const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
    this.move(delta, direction);
    this.handleRangedAttack(delta, player);
  }

  handleRangedAttack(delta: number, player: Character) {
    if (!this.isAttacking && this.attackCooldown <= 0) {
      this.isAttacking = true;

      const bullet = this.scene.add.circle(this.x, this.y, 5, 0x00FFFF); // Cyan color
      const bulletSpeed = 300;
      const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
      const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).scale(bulletSpeed);

      this.scene.physics.add.existing(bullet);
      const bulletBody = bullet.body as Phaser.Physics.Arcade.Body;
      bulletBody.setVelocity(velocity.x, velocity.y);

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

export { MeleeEnemy, RangedEnemy };
