import { Physics } from "phaser";

export class Door extends Physics.Arcade.Sprite {
  isOpen: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'door');
    this.isOpen = false;
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  toggleDoor() {
    if (!this.isOpen) {
      this.isOpen = !this.isOpen;
      // Add more code here to change the door's appearance or behavior when it's open or closed
    }
  }
}
