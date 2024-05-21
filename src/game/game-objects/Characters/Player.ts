import Character from "./Character.ts";
import InputHandler from "../InputHandler.ts";
import { GameLevel1 } from "../../scenes/GameLevel1.ts";
import { Bullet } from "./Bullet.ts";
import { RangedEnemy } from "./RangedEnemy.ts";
import { MeleeEnemy } from "./MeleeEnemy.ts";

class Player extends Character {
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
  dodgeCooldownTime: number;
  inputHandler: InputHandler;

  constructor(scene: GameLevel1, x: number, y: number) {
    super(scene, x, y, 0x0047AB, 300);
    this.dodgeSpeed = 600;
    this.dodgeCooldown = 0;
    this.dodgeTime = 200;
    this.isDodging = false;
    this.dodgeDirection = new Phaser.Math.Vector2();
    this.parryDuration = 100;
    this.isParrying = false;
    this.parryCooldown = 0;
    this.attackDuration = 200;
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.parryCooldownTime = 1000;
    this.attackCooldownTime = 500;
    this.dodgeCooldownTime = 500;
    this.inputHandler = new InputHandler(scene);
  }

  handleDodge(moveDirection: Phaser.Math.Vector2) {
    if (this.isDodging || this.dodgeCooldown > 0) return;
    this.isDodging = true;
    this.setAlpha(0.5);

    if (this.inputHandler.isMoving) {
      this.dodgeDirection.x = moveDirection.x;
      this.dodgeDirection.y = moveDirection.y;
    } else {
      const dodgeAngle = this.rotation - Math.PI / 2; // Adjust to dodge backwards?
      this.dodgeDirection = new Phaser.Math.Vector2(Math.cos(dodgeAngle), Math.sin(dodgeAngle)).normalize();
    }

    // Reset cooldown immediately
    this.dodgeCooldown = this.dodgeCooldownTime;

    // Start the dodge effect
    this.scene.time.delayedCall(this.dodgeTime, () => {
      this.isDodging = false;
      this.setAlpha(1);
    });
  }

  handleParry() {
    if (this.isParrying || this.parryCooldown > 0) return;

    this.isParrying = true;

    // Graphics object for visual representation of the parry zone
    const graphics = this.scene.add.graphics();
    const startRadius = 25;
    const endRadius = 40;
    const duration = this.parryDuration;
    const startAngle = this.rotation + Math.PI / 2; // Compensate for sprite orientation
    const arcAngle = Math.PI / 4; // The arc spans 60 degrees

    // Define the parry hitbox as a circle
    const parryHitbox = new Phaser.Geom.Circle(this.x, this.y, endRadius);

    // Update the graphics and check collisions in an arc
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: duration,
      onUpdate: (tween) => {
        const progress = tween.getValue();
        const radius = startRadius + (endRadius - startRadius) * progress;

        // Update graphics for the parry zone
        graphics.clear();
        graphics.lineStyle(2, 0x0000FF, 1); // Blue color for visibility
        graphics.beginPath();
        graphics.arc(this.x, this.y, radius, startAngle - arcAngle / 2, startAngle + arcAngle / 2);
        graphics.strokePath();
        graphics.closePath();

        // Check for collision with bullets
        this.scene.bullets.getChildren().forEach((gameObject) => {
          const bullet = gameObject as Bullet;
          const angleToBullet = Phaser.Math.Angle.Between(this.x, this.y, bullet.x, bullet.y);
          const angleDifference = Phaser.Math.Angle.Wrap(angleToBullet - startAngle);
          const withinArc = Math.abs(angleDifference) <= arcAngle / 2;

          if (withinArc && Phaser.Geom.Circle.ContainsPoint(parryHitbox, {
            x: bullet.x,
            y: bullet.y,
          })) {
            bullet.reflect();
          }
        });
      },
      onComplete: () => {
        graphics.destroy();
        this.isParrying = false;
        this.parryCooldown = this.parryCooldownTime;
      },
    });
  }

  handleMeleeAttack() {
    if (this.isAttacking || this.attackCooldown > 0) return;
    this.isAttacking = true;

    // Create the graphics object
    const graphics = this.scene.add.graphics();
    const radius = 60;
    const startAngle = this.rotation + Math.PI / 8;
    const endAngle = startAngle + Math.PI * 3 / 4;

    // Function to update the graphics
    const updateGraphics = (progress: number) => {
      // Clear the previous drawing
      graphics.clear();

      // Calculate the current angle based on the progress
      const currentAngle = startAngle + (endAngle - startAngle) * progress;

      // Calculate the coordinates of the triangle's tip
      const tipX = this.x + radius * Math.cos(currentAngle);
      const tipY = this.y + radius * Math.sin(currentAngle);

      // Calculate the coordinates of the triangle's base
      const baseX1 = this.x + (radius - 10) * Math.cos(currentAngle + Math.PI / 8);
      const baseY1 = this.y + (radius - 10) * Math.sin(currentAngle + Math.PI / 8);
      const baseX2 = this.x + (radius - 10) * Math.cos(currentAngle - Math.PI / 8);
      const baseY2 = this.y + (radius - 10) * Math.sin(currentAngle - Math.PI / 8);

      // Draw the triangle
      graphics.fillStyle(0xFF0000, 1); // Red color
      graphics.beginPath();
      graphics.moveTo(tipX, tipY);
      graphics.lineTo(baseX1, baseY1);
      graphics.lineTo(baseX2, baseY2);
      graphics.closePath();
      graphics.fillPath();

      // Check for collision with enemies
      const swordHitbox = new Phaser.Geom.Triangle(tipX, tipY, baseX1, baseY1, baseX2, baseY2);
      [...this.scene.spawner.meleeEnemies.getChildren(), ...this.scene.spawner.rangedEnemies.getChildren()].forEach(gameObject => {
        const enemy = gameObject as RangedEnemy | MeleeEnemy;
        const enemyHitbox = new Phaser.Geom.Triangle(enemy.x - 16, enemy.y - 16, enemy.x, enemy.y + 16, enemy.x + 16, enemy.y - 16);
        if (Phaser.Geom.Intersects.TriangleToTriangle(swordHitbox, enemyHitbox)) {
          enemy.destroyEnemy(); // Call destroyEnemy method on the enemy
        }
      });
    };

    // Update the graphics over time with easing
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
        this.attackCooldown = 1000;
      },
    });
    this.attackCooldown = this.attackCooldownTime;
  }

  handleFacing() {
    let angle;
    if (this.inputHandler.lastInputSource === "gamepad") {
      const rightStickDirection = this.inputHandler.getRightStickDirection();
      if (rightStickDirection) {
        angle = Phaser.Math.Angle.Between(0, 0, rightStickDirection.x, rightStickDirection.y);
      } else {
        // Fallback if no input from gamepad
        return;
      }
    } else {
      const pointer = this.scene.input.activePointer;
      const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
      angle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y);
    }

    this.rotation = angle - Math.PI / 2;
  }


  cooldownUpdate(delta: number) {
    if (this.dodgeCooldown > 0) {
      this.dodgeCooldown -= delta;
    }
    if (this.parryCooldown > 0) {
      this.parryCooldown -= delta;
    }
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
  }

  handleMovement(delta: number, moveDirection: Phaser.Math.Vector2) {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.isDodging) {
      const velocityX = this.dodgeDirection.x * this.dodgeSpeed;
      const velocityY = this.dodgeDirection.y * this.dodgeSpeed;
      body.setVelocity(velocityX, velocityY);
    } else if (moveDirection.x !== 0 || moveDirection.y !== 0) {
      super.handleMove(delta, moveDirection);
    } else {
      body.setVelocity(0, 0);
    }
  }

  update(_time: number, delta: number) {
    const moveDirection = this.inputHandler.getMoveDirection();

    this.handleFacing();
    this.handleMovement(delta, moveDirection);

    if (this.inputHandler.isActionPressed("dodge")) {
      this.handleDodge(moveDirection);
    }

    if (this.inputHandler.isActionPressed("attack")) {
      this.handleMeleeAttack();
    }

    if (this.inputHandler.isActionPressed("parry")) {
      this.handleParry();
    }

    this.cooldownUpdate(delta);
  }
}

export default Player;
