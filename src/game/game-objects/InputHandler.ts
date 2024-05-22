import { Scene, Input } from 'phaser';

export default class InputHandler {
  lastInputSource: 'keyboard & mouse' | 'gamepad' = 'keyboard & mouse'; // Default to mouse

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private wasd: { [key: string]: Phaser.Input.Keyboard.Key };

  private gamepad: Phaser.Input.Gamepad.Gamepad | null;

  isMoving: boolean;

  constructor(private scene: Scene) {
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.cursors.space = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE,
      );

      this.wasd = {
        w: this.scene.input.keyboard?.addKey(Input.Keyboard.KeyCodes.W),
        a: this.scene.input.keyboard?.addKey(Input.Keyboard.KeyCodes.A),
        s: this.scene.input.keyboard?.addKey(Input.Keyboard.KeyCodes.S),
        d: this.scene.input.keyboard?.addKey(Input.Keyboard.KeyCodes.D),
        e: this.scene.input.keyboard?.addKey(Input.Keyboard.KeyCodes.E),
      };
    } else {
      throw new Error('InputHandler requires a scene with an input manager');
    }

    this.scene.input.gamepad?.once(
      'connected',
      (pad: Input.Gamepad.Gamepad | null) => {
        this.gamepad = pad;
      },
    );
    this.isMoving = false;
  }

  getMoveDirection(): Phaser.Math.Vector2 {
    let x = 0;
    let y = 0;

    // Keyboard input
    if (this.cursors.left.isDown || this.wasd.a.isDown) {
      x -= 1;
      this.lastInputSource = 'keyboard & mouse';
    }
    if (this.cursors.right.isDown || this.wasd.d.isDown) {
      x += 1;
      this.lastInputSource = 'keyboard & mouse';
    }
    if (this.cursors.up.isDown || this.wasd.w.isDown) {
      y -= 1;
      this.lastInputSource = 'keyboard & mouse';
    }
    if (this.cursors.down.isDown || this.wasd.s.isDown) {
      y += 1;
      this.lastInputSource = 'keyboard & mouse';
    }

    // Gamepad input
    if (this.gamepad) {
      x += this.gamepad.leftStick.x;
      y += this.gamepad.leftStick.y;
      this.lastInputSource = 'gamepad';
    }

    this.isMoving = x !== 0 || y !== 0;

    return new Phaser.Math.Vector2(x, y).normalize();
  }

  getRightStickDirection(): Phaser.Math.Vector2 | null {
    if (this.gamepad && this.gamepad.rightStick) {
      const x = this.gamepad.rightStick.x;
      const y = this.gamepad.rightStick.y;
      const deadZone = 0.1; // Define a dead zone to ignore minor inputs
      if (Math.abs(x) > deadZone || Math.abs(y) > deadZone) {
        // Check if the stick is outside the dead zone
        return new Phaser.Math.Vector2(x, y).normalize();
      }
    }
    return null;
  }

  isActionPressed(action: 'dodge' | 'attack' | 'parry'): boolean {
    switch (action) {
      case 'dodge':
        return (
          this.cursors.space.isDown ||
          (this.gamepad &&
            (this.gamepad.buttons[0].pressed || // A button
              this.gamepad.buttons[4].pressed)) // Left Bumper
        );
      case 'attack':
        return (
          this.scene.input.keyboard.checkDown(this.wasd.e) ||
          (this.gamepad &&
            (this.gamepad.buttons[1].pressed || // B button
              this.gamepad.buttons[7].pressed)) // Right Trigger
        );
      case 'parry':
        return (
          this.scene.input.activePointer.isDown ||
          (this.gamepad &&
            (this.gamepad.buttons[2].pressed || // X button
              this.gamepad.buttons[5].pressed)) // Right Bumper
        );
      default:
        return false;
    }
  }
}
