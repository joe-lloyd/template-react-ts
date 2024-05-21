import Enemy from "./Enemy.ts";
import { GameLevel1 } from "../../scenes/GameLevel1.ts";

export class MeleeEnemy extends Enemy {
  constructor(scene: GameLevel1, x: number, y: number) {
    super(scene, x, y, 0xFF00FF, 100);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.attackDuration = 200;
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.attackCooldownTime = 500;
  }

  handleMeleeAttack() {
    if (this.isAttacking || this.attackCooldown > 0) return;
      this.isAttacking = true;

      const graphics = this.scene.add.graphics();
      const startAngle = this.rotation + Math.PI / 8;
      const endAngle = startAngle + Math.PI * 3 / 4;
      const radius = 40;

      const updateGraphics = (progress: number) => {
        graphics.clear();
        const currentAngle = startAngle + (endAngle - startAngle) * progress;
        const tipX = this.x + radius * Math.cos(currentAngle);
        const tipY = this.y + radius * Math.sin(currentAngle);
        const baseX1 = this.x + (radius - 10) * Math.cos(currentAngle + Math.PI / 8);
        const baseY1 = this.y + (radius - 10) * Math.sin(currentAngle + Math.PI / 8);
        const baseX2 = this.x + (radius - 10) * Math.cos(currentAngle - Math.PI / 8);
        const baseY2 = this.y + (radius - 10) * Math.sin(currentAngle - Math.PI / 8);

        graphics.fillStyle(0xFF00FF, 1); // Color
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
        ease: "Sine.InOut",
        onUpdate: (tween) => {
          updateGraphics(tween.getValue());
        },
        onComplete: () => {
          graphics.destroy();
          this.isAttacking = false;
          this.attackCooldown = 1000; // Set attack cooldown (1 second)
        },
      });

      this.attackCooldown = this.attackCooldownTime;
  }

  handleCooldowns(delta: number) {
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
  }

  update(_time: number, delta: number) {
    super.update(_time, delta);

    const direction = new Phaser.Math.Vector2(this.scene.player.x - this.x, this.scene.player.y - this.y).normalize();
    this.handleMove(delta, direction);
    this.handleMeleeAttack();
    // Rotate towards player
    this.rotation = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) - Math.PI / 2;

    this.handleCooldowns(delta);
  }
}
