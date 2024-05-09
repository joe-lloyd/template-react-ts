import Enemy from "./Enemy.ts";
import { Physics, Scene } from "phaser";
import Character from "./Character.ts";
import { Bullet } from "./Bullet.ts";

export class RangedEnemy extends Enemy {
  bullets: Phaser.Physics.Arcade.Group;
  attackRange: number;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 0x00FFFF, 150, 50);
    this.bullets = scene.physics.add.group({ classType: Phaser.GameObjects.Ellipse, runChildUpdate: true });
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
      const bullet = new Bullet(this.scene, this.x, this.y);
      const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
      bullet.fire(this.x, this.y, angle, 300);

      // Add bullet to the scene's central bullet group
      this.scene.bullets.add(bullet);

      this.scene.time.delayedCall(10000, () => bullet.destroy());
      this.isAttacking = false;
      this.attackCooldown = 1000; // 1 second cooldown
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
  }
}
