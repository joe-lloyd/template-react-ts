import { Scene, Types, Input } from "phaser";

export default class InputHandler {
  cursors: Types.Input.Keyboard.CursorKeys;
  wasd: Record<'w' | 'a' | 's' | 'd' | 'e', Input.Keyboard.Key>;
  gamepad: Input.Gamepad.Gamepad | null = null;
  isMoving: boolean;

  constructor(private scene: Scene) {
    // Keyboard setup
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.cursors.space = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.wasd = {
      w: this.scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.W),
      a: this.scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.A),
      s: this.scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.S),
      d: this.scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.D),
      e: this.scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.E),
    };

    // Gamepad setup
    this.scene.input.gamepad.once('connected', (pad) => {
      console.log('Gamepad connected', pad.id);
      this.gamepad = pad;
    });
    this.isMoving = false;
  }

  getMoveDirection(): Phaser.Math.Vector2 {
    let x = 0;
    let y = 0;

    // Keyboard input
    if (this.cursors.left.isDown || this.wasd.a.isDown) {
      x -= 1;
    }
    if (this.cursors.right.isDown || this.wasd.d.isDown) {
      x += 1;
    }
    if (this.cursors.up.isDown || this.wasd.w.isDown) {
      y -= 1;
    }
    if (this.cursors.down.isDown || this.wasd.s.isDown) {
      y += 1;
    }

    // Gamepad input
    if (this.gamepad) {
      x += this.gamepad.leftStick.x;
      y += this.gamepad.leftStick.y;
    }

    this.isMoving = x !== 0 || y !== 0;

    return new Phaser.Math.Vector2(x, y).normalize();
  }

  isActionPressed(action: 'dodge' | 'attack' | 'parry'): boolean {
    switch (action) {
      case 'dodge':
        // console.log(this.cursors.space.isDown, this.gamepad && this.gamepad.buttons[0].pressed);
        return (this.cursors.space.isDown || (this.gamepad && this.gamepad.buttons[0].pressed));
      case 'attack':
        return (this.scene.input.keyboard.checkDown(this.wasd.e) || (this.gamepad && this.gamepad.buttons[1].pressed));
      case 'parry':
        return (this.scene.input.activePointer.isDown || (this.gamepad && this.gamepad.buttons[2].pressed));
      default:
        return false;
    }
  }
}
