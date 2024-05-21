import { Physics } from "phaser";
import { GameLevel1 } from "../../scenes/GameLevel1.ts";

export class Door extends Physics.Arcade.Sprite {
  isOpen: boolean;
  scene: GameLevel1;
  roomIndex: number;

  constructor(scene: GameLevel1, x: number, y: number, roomIndex: number) {
    super(scene, x, y, 'door');
    this.isOpen = false;
    this.scene = scene;
    this.roomIndex = roomIndex;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Add overlap with the player
    scene.physics.add.overlap(scene.player, this, this.handleOverlap, undefined, this);
    console.log(`Door created at (${x}, ${y}) for room index ${roomIndex}`);
  }

  handleOverlap() {
    console.log(`Overlap detected for door at (${this.x}, ${this.y}) with room index ${this.roomIndex}`);
    if (!this.isOpen) {
      this.toggleDoor();
      const roomConfig = this.scene.map.rooms[this.roomIndex + 1]; // Open the next room
      console.log(`Opening door ${this.roomIndex + 1} with config:`, roomConfig);
      if (roomConfig) {
        this.scene.spawner.spawnEnemies(roomConfig);
      } else {
        console.error(`No room configuration found for door ${this.roomIndex + 1}`);
      }
    }
  }

  toggleDoor() {
    this.isOpen = !this.isOpen;
    console.log(`Door at (${this.x}, ${this.y}) is now ${this.isOpen ? 'open' : 'closed'}`);
  }
}
