import Character from "./character";
import { GameObjects, Physics, Scene } from "phaser";

class MeleeEnemy extends Character {
  separationDistance: number;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 0xFF00FF); // Pink color
    this.speed = 150; // Set speed slower than player
    this.separationDistance = 50; // Minimum distance from other enemies
  }

  update(delta: number, player: Character, enemies: Character[]) {
    this.applySeparation(enemies);

    const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
    this.move(delta, direction);
    this.handleMeleeAttack(delta, 0xFF00FF, 40); // Pink triangle
  }

  applySeparation(enemies: Character[]) {
    let moveX = 0;
    let moveY = 0;
    let neighborCount = 0;

    for (const enemy of enemies) {
      if (enemy !== this) {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
        if (distance < this.separationDistance) {
          moveX += this.x - enemy.x;
          moveY += this.y - enemy.y;
          neighborCount++;
        }
      }
    }

    if (neighborCount > 0) {
      const separationVector = new Phaser.Math.Vector2(moveX, moveY).normalize();
      this.x += separationVector.x * this.speed * 0.1;
      this.y += separationVector.y * this.speed * 0.1;
    }
  }

  destroyEnemy() {
    // Stop attacking
    this.isAttacking = false;

    // Particle explosion using small circles
    const explosionParticles: GameObjects.Graphics[] = [];

    for (let i = 0; i < 50; i++) {
      const particle = this.scene.add.graphics({ fillStyle: { color: 730274 } });
      particle.fillCircle(0, 0, 5);
      particle.setPosition(this.x, this.y);

      // Set random velocity
      const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
      const speed = Phaser.Math.FloatBetween(50, 100);
      const velocity = new Phaser.Math.Vector2(Math.cos(angle) * speed, Math.sin(angle) * speed);

      explosionParticles.push(particle);

      // Animate the particle
      this.scene.tweens.add({
        targets: particle,
        x: { value: this.x + velocity.x, duration: 500 },
        y: { value: this.y + velocity.y, duration: 500 },
        alpha: { value: 0, duration: 500 },
        onComplete: () => {
          particle.destroy();
        }
      });
    }

    // Destroy the enemy sprite
    this.sprite.destroy();
  }
}

class RangedEnemy extends Character {
  bullets: Phaser.Physics.Arcade.Group;
  separationDistance: number;
  attackRange: number;

  constructor(scene: Scene, x: number, y: number, bullets: Phaser.Physics.Arcade.Group) {
    super(scene, x, y, 0x00FFFF); // Cyan color
    this.bullets = bullets;
    this.speed = 100; // Set speed slower than player
    this.attackRange = 200; // Set desired range for shooting
    this.separationDistance = 50; // Minimum distance from other enemies
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

  applySeparation(enemies: Character[]) {
    let moveX = 0;
    let moveY = 0;
    let neighborCount = 0;

    for (const enemy of enemies) {
      if (enemy !== this) {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
        if (distance < this.separationDistance) {
          moveX += this.x - enemy.x;
          moveY += this.y - enemy.y;
          neighborCount++;
        }
      }
    }

    if (neighborCount > 0) {
      const separationVector = new Phaser.Math.Vector2(moveX, moveY).normalize();
      this.x += separationVector.x * this.speed * 0.1;
      this.y += separationVector.y * this.speed * 0.1;
    }
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

  destroyEnemy() {
    // Stop attacking
    this.isAttacking = false;

    // Particle explosion using small circles
    const explosionParticles: GameObjects.Graphics[] = [];

    for (let i = 0; i < 50; i++) {
      const particle = this.scene.add.graphics({ fillStyle: { color: 730274 } });
      particle.fillCircle(0, 0, 5);
      particle.setPosition(this.x, this.y);

      // Set random velocity
      const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
      const speed = Phaser.Math.FloatBetween(50, 100);
      const velocity = new Phaser.Math.Vector2(Math.cos(angle) * speed, Math.sin(angle) * speed);

      explosionParticles.push(particle);

      // Animate the particle
      this.scene.tweens.add({
        targets: particle,
        x: { value: this.x + velocity.x, duration: 500 },
        y: { value: this.y + velocity.y, duration: 500 },
        alpha: { value: 0, duration: 500 },
        onComplete: () => {
          particle.destroy();
        }
      });
    }

    // Destroy the enemy sprite
    this.sprite.destroy();
  }

}

export { RangedEnemy, MeleeEnemy };
