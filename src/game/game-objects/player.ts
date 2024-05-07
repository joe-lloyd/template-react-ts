import { GameObjects, Scene, Types } from "phaser";

class Player {
  sprite: GameObjects.Graphics;
  speed: number;
  dodgeSpeed: number;
  dodgeCooldown: number;
  dodgeTime: number;
  isDodging: boolean;
  cursors: Types.Input.Keyboard.CursorKeys;
  wasd: { w: Types.Input.Keyboard.Key, a: Types.Input.Keyboard.Key, s: Types.Input.Keyboard.Key, d: Types.Input.Keyboard.Key };
  scene: Scene;
  x: number;
  y: number;
  lastDirection: Phaser.Math.Vector2;
  dodgeDirection: Phaser.Math.Vector2;
  parryDuration: number;
  isParrying: boolean;
  parryCooldown: number;
  parryCooldownTime: number;
  attackDuration: number;
  isAttacking: boolean;
  attackCooldown: number;
  attackCooldownTime: number;
  enemies: any[]; // Reference to enemies

  constructor(scene: Scene, x: number, y: number, enemies: any[]) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.sprite = scene.add.graphics({ fillStyle: { color: 0xFF0000 } });
    this.updatePosition(x, y);
    this.speed = 200;
    this.dodgeSpeed = 500;
    this.dodgeCooldown = 0;
    this.dodgeTime = 200; // 200ms dodge time
    this.isDodging = false;
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = {
      w: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
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
    this.enemies = enemies; // Store reference to enemies
  }

  updatePosition(x: number, y: number) {
    this.sprite.clear();
    this.sprite.fillTriangle(-16, -16, 0, 16, 16, -16);
    this.sprite.setPosition(x, y);
  }

  move(delta: number) {
    // Handle Dodge Roll
    this.handleDodge(delta);

    // Handle Regular Movement
    if (!this.isDodging) {
      this.handleMovement(delta);
    }

    // Get world coordinates of the pointer
    const pointer = this.scene.input.activePointer;
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);

    // Rotate towards the mouse pointer
    const angle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y);
    this.sprite.rotation = angle - Math.PI / 2;

    this.updatePosition(this.x, this.y);
  }

  handleMovement(delta: number) {
    let moveX = 0;
    let moveY = 0;

    if (this.cursors.left?.isDown || this.wasd.a.isDown) {
      moveX = -1;
    } else if (this.cursors.right?.isDown || this.wasd.d.isDown) {
      moveX = 1;
    }

    if (this.cursors.up?.isDown || this.wasd.w.isDown) {
      moveY = -1;
    } else if (this.cursors.down?.isDown || this.wasd.s.isDown) {
      moveY = 1;
    }

    if (moveX !== 0 || moveY !== 0) {
      const direction = new Phaser.Math.Vector2(moveX, moveY).normalize();
      this.x += direction.x * this.speed * delta / 1000;
      this.y += direction.y * this.speed * delta / 1000;
      this.lastDirection = direction; // Update last direction
    }
  }

  handleDodge(delta: number) {
    // Dodge Roll Logic
    if (this.cursors.space.isDown && !this.isDodging && this.dodgeCooldown <= 0) {
      this.isDodging = true;
      this.sprite.setAlpha(0.5);

      // Check if any movement key is currently held down
      const isMoving = this.cursors.left?.isDown ||
        this.cursors.right?.isDown ||
        this.cursors.up?.isDown ||
        this.cursors.down?.isDown ||
        this.wasd.w.isDown ||
        this.wasd.a.isDown ||
        this.wasd.s.isDown ||
        this.wasd.d.isDown;

      if (isMoving) {
        // If player is moving, dodge in the last movement direction
        this.dodgeDirection = this.lastDirection.clone().normalize();
      } else {
        // Calculate the dodge angle based on the player's facing direction
        const dodgeAngle = this.sprite.rotation - Math.PI /2; // Subtract PI to get the opposite direction

        this.dodgeDirection = new Phaser.Math.Vector2(Math.cos(dodgeAngle), Math.sin(dodgeAngle)).normalize();

      }


      this.dodgeCooldown = 1000; // 1-second cooldown
      this.scene.time.delayedCall(this.dodgeTime, () => {
        this.isDodging = false;
        this.sprite.setAlpha(1);
      });
    }

    // Perform dodge movement
    if (this.isDodging) {
      this.x += this.dodgeDirection.x * this.dodgeSpeed * delta / 1000;
      this.y += this.dodgeDirection.y * this.dodgeSpeed * delta / 1000;
    }

    // Update the cooldown timer
    if (this.dodgeCooldown > 0) {
      this.dodgeCooldown -= delta;
    }
  }

  handleParry(delta: number) {
    if (this.scene.input.activePointer.isDown && !this.isParrying && this.parryCooldown <= 0) {
      this.isParrying = true;

      // Create the graphics object
      const graphics = this.scene.add.graphics();
      const startRadius = 25;
      const endRadius = 40;
      const startOpacity = 0.7;
      const endOpacity = 1;
      const duration = this.parryDuration;
      const startAngle = this.sprite.rotation + Math.PI / 8;
      const endAngle = startAngle + Math.PI * 3 / 4;

      // Function to update the graphics
      const updateGraphics = (progress: number) => {
        const radius = startRadius + (endRadius - startRadius) * progress;
        const opacity = startOpacity + (endOpacity - startOpacity) * progress;

        graphics.clear();
        graphics.lineStyle(2, 0x0000FF, opacity); // Blue color
        graphics.beginPath();
        graphics.arc(this.x, this.y, radius, startAngle, endAngle);
        graphics.strokePath();
        graphics.closePath();
      };

      // Update the graphics over time
      this.scene.tweens.addCounter({
        from: 0,
        to: 1,
        duration: duration,
        onUpdate: (tween) => {
          updateGraphics(tween.getValue());
        },
        onComplete: () => {
          graphics.destroy();
          this.isParrying = false;
          this.parryCooldown = 1000; // Set parry cooldown (1 second)
        }
      });

      // Start the parry cooldown
      this.parryCooldown = this.parryCooldownTime;
    }

    // Update the parry cooldown timer
    if (this.parryCooldown > 0) {
      this.parryCooldown -= delta;
    }
  }

  handleMeleeAttack(delta: number) {
    if (this.scene.input.keyboard.addKey('E').isDown && !this.isAttacking && this.attackCooldown <= 0) {
      this.isAttacking = true;

      // Create the graphics object
      const graphics = this.scene.add.graphics();
      const radius = 60;
      const startAngle = this.sprite.rotation + Math.PI / 8;
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
        this.enemies.forEach(enemy => {
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

      // Start the attack cooldown
      this.attackCooldown = this.attackCooldownTime;
    }

    // Update the attack cooldown timer
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
  }

  update(delta: number) {
    this.move(delta);
    this.handleParry(delta);
    this.handleMeleeAttack(delta);
  }
}

export default Player;
