import { GameObjects, Scene } from "phaser";

class Character {
  sprite: GameObjects.Graphics;
  speed: number;
  x: number;
  y: number;
  scene: Scene;
  lastDirection: Phaser.Math.Vector2;
  dodgeSpeed: number;
  dodgeCooldown: number;
  dodgeTime: number;
  isDodging: boolean;
  dodgeDirection: Phaser.Math.Vector2;
  parryDuration: number;
  isParrying: boolean;
  parryCooldown: number;
  parryCooldownTime: number;
  attackDuration: number;
  isAttacking: boolean;
  attackCooldown: number;
  attackCooldownTime: number;

  constructor(scene: Scene, x: number, y: number, color: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.sprite = scene.add.graphics({ fillStyle: { color } });
    this.updatePosition(x, y);
    this.speed = 200;
    this.dodgeSpeed = 500;
    this.dodgeCooldown = 0;
    this.dodgeTime = 200; // 200ms dodge time
    this.isDodging = false;
    this.lastDirection = new Phaser.Math.Vector2(0, -1); // Initial direction up
    this.dodgeDirection = new Phaser.Math.Vector2();
    this.parryDuration = 100; // Duration of the parry in frames
    this.isParrying = false;
    this.parryCooldown = 0;
    this.parryCooldownTime = 1000;
    this.attackDuration = 200;
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.attackCooldownTime = 500;
  }

  updatePosition(x: number, y: number) {
    this.sprite.clear();
    this.sprite.fillTriangle(-16, -16, 0, 16, 16, -16);
    this.sprite.setPosition(x, y);
  }

  move(delta: number, direction: Phaser.Math.Vector2) {
    this.x += direction.x * this.speed * delta / 1000;
    this.y += direction.y * this.speed * delta / 1000;
    this.updatePosition(this.x, this.y);
  }

  handleDodge(delta: number, direction: Phaser.Math.Vector2) {
    if (this.isDodging) {
      this.x += direction.x * this.dodgeSpeed * delta / 1000;
      this.y += direction.y * this.dodgeSpeed * delta / 1000;
    }

    if (this.dodgeCooldown > 0) {
      this.dodgeCooldown -= delta;
    }
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
}

export default Character;
