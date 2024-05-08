import Enemy from "./Enemy.ts";
import { Scene } from "phaser";
import Character from "./Character.ts";

export class MeleeEnemy extends Enemy {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 0xFF00FF, 150, 50); // Pink color
    this.attackDuration = 200;
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.attackCooldownTime = 500;
  }

  handleMeleeAttack(delta: number, color: number, radius: number) {
    if (!this.isAttacking && this.attackCooldown <= 0) {
      this.isAttacking = true;

      const graphics = this.scene.add.graphics();
      const startAngle = this.sprite.rotation + Math.PI / 8;
      const endAngle = startAngle + Math.PI * 3 / 4;

      const updateGraphics = (progress: number) => {
        graphics.clear();
        const currentAngle = startAngle + (endAngle - startAngle) * progress;
        const tipX = this.x + radius * Math.cos(currentAngle);
        const tipY = this.y + radius * Math.sin(currentAngle);
        const baseX1 = this.x + (radius - 10) * Math.cos(currentAngle + Math.PI / 8);
        const baseY1 = this.y + (radius - 10) * Math.sin(currentAngle + Math.PI / 8);
        const baseX2 = this.x + (radius - 10) * Math.cos(currentAngle - Math.PI / 8);
        const baseY2 = this.y + (radius - 10) * Math.sin(currentAngle - Math.PI / 8);

        graphics.fillStyle(color, 1); // Color
        graphics.beginPath();
        graphics.moveTo(tipX, tipY);
        graphics.lineTo(baseX1, baseY1);
        graphics.lineTo(baseX2, baseY2);
        graphics.closePath();
        graphics.fillPath();
      };

      this.scene.tweens.addCounter({
        from: 0,
        to: 1,
        duration: this.attackDuration,
        ease: 'Sine.InOut',
        onUpdate: (tween) => {
          updateGraphics(tween.getValue());
        },
        onComplete: () => {
          graphics.destroy();
          this.isAttacking = false;
          this.attackCooldown = 1000; // Set attack cooldown (1 second)
        }
      });

      this.attackCooldown = this.attackCooldownTime;
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
  }

  update(delta: number, player: Character, enemies: Character[]) {
    this.applySeparation(enemies);

    const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
    this.move(delta, direction);
    this.handleMeleeAttack(delta, 0xFF00FF, 40); // Pink triangle
  }
}
