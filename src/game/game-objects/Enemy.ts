// Enemy.ts
import Character from "./Character.ts";
import { GameObjects, Scene } from "phaser";

class Enemy extends Character {
  separationDistance: number;
  attackDuration: number;
  isAttacking: boolean;
  attackCooldown: number;
  attackCooldownTime: number;
  isDestroyed: boolean;
  isBeingDestroyed: boolean;

  constructor(scene: Scene, x: number, y: number, color: number, speed: number, separationDistance: number) {
    super(scene, x, y, color, speed);
    this.separationDistance = separationDistance;
    this.isDestroyed = false;
    this.isBeingDestroyed = false;
  }

  getBounds() {
    const worldWidth = this.scene.physics.world.bounds.width;
    const worldHeight = this.scene.physics.world.bounds.height;
    return new Phaser.Geom.Rectangle(this.x, this.y, worldWidth, worldHeight);
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
    if (this.isBeingDestroyed) {
      return;
    }
    this.isBeingDestroyed = true;
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

    this.sprite.destroy();

    this.scene.tweens.add({
      targets: this.scene.physics.world,
      props: {
        timeScale: { value: 1.5, duration: 300, ease: 'Sine.easeInOut' } // Slow down
      },
      yoyo: true, // Makes the tween reverse using the same duration and ease
      hold: 200,
      onComplete: () => {
        this.scene.physics.world.timeScale = 1; // Ensure it's set back to normal
        this.isDestroyed = true;
      }
    });
  }

}

export default Enemy;
