import Enemy from './Enemy';
import { Bullet } from './Bullet';
import { GameLevel1 } from '../../scenes/GameLevel1';

export class RangedEnemy extends Enemy {
  bullets: Phaser.Physics.Arcade.Group;

  attackRange: number;

  constructor(scene: GameLevel1, x: number, y: number) {
    super(scene, x, y, 0x00ff00, 100);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.bullets = scene.physics.add.group({
      classType: Phaser.GameObjects.Ellipse,
      runChildUpdate: true,
    });
    this.attackRange = 200; // Set desired range for shooting
    this.isAttacking = false;
    this.attackCooldown = 0;
  }

  handleRangedAttack() {
    if (this.isAttacking || this.attackCooldown > 0) return;
    this.isAttacking = true;
    const bullet = new Bullet(this.scene, this.x, this.y);
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.player.x,
      this.scene.player.y,
    );
    bullet.fire(this.x, this.y, angle, 300);

    // Add bullet to the scene's central bullet group
    this.scene.bullets.add(bullet);

    this.scene.time.delayedCall(10000, () => bullet.destroy());
    this.isAttacking = false;
    this.attackCooldown = 1000;
  }

  handleCooldowns(delta: number) {
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
  }

  update(_time: number, delta: number) {
    super.update(_time, delta);

    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.scene.player.x,
      this.scene.player.y,
    );
    let direction = new Phaser.Math.Vector2(0, 0);

    // Move towards player if outside attack range
    if (distance > this.attackRange) {
      direction = new Phaser.Math.Vector2(
        this.scene.player.x - this.x,
        this.scene.player.y - this.y,
      ).normalize();
      this.handleMove(delta, direction);
    }

    // Rotate towards player
    this.rotation =
      Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.scene.player.x,
        this.scene.player.y,
      ) -
      Math.PI / 2;

    this.handleRangedAttack();
    this.handleCooldowns(delta);
  }
}
