// Enemy.ts
import Character from "./Character.ts";
import { GameLevel1 } from "../scenes/GameLevel1.ts";

class Enemy extends Character {
  attackDuration: number;
  isAttacking: boolean;
  attackCooldown: number;
  attackCooldownTime: number;
  isDestroyed: boolean;
  isBeingDestroyed: boolean;

  constructor(scene: GameLevel1, x: number, y: number, color: number, speed: number) {
    super(scene, x, y, color, speed);
    this.isDestroyed = false;
    this.isBeingDestroyed = false;
    this.isDestroyed = false;
  }

  destroyEnemy() {
    if (this.isBeingDestroyed) {
      return;
    }
    this.isBeingDestroyed = true;
    this.setAlpha(0);

    // Particle explosion using small circles
    const explosionParticles: Phaser.GameObjects.Graphics[] = [];

    for (let i = 0; i < 50; i++) {
      const particle = this.scene.add.graphics({ fillStyle: { color: 0xB22222 } }); // Adjusted color code
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
        },
      });
    }

    this.scene.tweens.add({
      targets: this.scene.physics.world,
      props: {
        timeScale: { value: 1.5, duration: 300, ease: "Sine.easeInOut" }, // Slow down
      },
      yoyo: true, // Makes the tween reverse using the same duration and ease
      hold: 200,
      onComplete: () => {
        this.scene.physics.world.timeScale = 1; // Ensure it's set back to normal
        this.isDestroyed = true;

        // Destroy the enemy after the animation
        this.destroy();
      },
    });
  }

  update(_time: number, delta: number) {
    super.update(_time, delta);
  }
}

export default Enemy;
