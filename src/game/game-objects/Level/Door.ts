import { Physics } from "phaser";
import { GameLevel1 } from "../../scenes/GameLevel1.ts";

export class Door extends Physics.Arcade.Sprite {
  isOpen: boolean;
  scene: GameLevel1;
  roomIndex: number;
  graphics: Phaser.GameObjects.Graphics;

  constructor(scene: GameLevel1, x: number, y: number, roomIndex: number, width: number, height: number) {
    super(scene, x + width / 2, y + height / 2, 'door');
    this.isOpen = false;
    this.scene = scene;
    this.roomIndex = roomIndex;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setDisplaySize(width, height);
    this.refreshBody();

    this.graphics = this.scene.add.graphics();
    this.graphics.fillStyle(0xff0000, 1);
    this.graphics.fillRect(x, y, width, height);

    this.scene.physics.add.overlap(this.scene.player, this, this.handleOverlap, undefined, this);
  }

  handleOverlap() {
    if (this.isOpen) return;

    this.toggleDoor();
    const roomConfig = this.scene.map.rooms[this.roomIndex];
    if (roomConfig) {
      this.scene.spawner.spawnEnemies(roomConfig);
    } else {
      console.error(`No room configuration found for door ${this.roomIndex}`);
    }
  }

  toggleDoor() {
    this.isOpen = !this.isOpen;
    this.setAlpha(this.isOpen ? 0 : 1);
    this.graphics.setAlpha(this.isOpen ? 0 : 1);
    console.log(`Door at (${this.x}, ${this.y}) is now ${this.isOpen ? 'open' : 'closed'}`);
  }
}
