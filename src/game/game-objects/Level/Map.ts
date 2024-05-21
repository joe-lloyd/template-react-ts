import Phaser from 'phaser';
import { Wall } from "./Wall.ts";

export class Map extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this.scene = scene;
  }

  createMapLayout() {
    // Adjusted room dimensions
    const roomWidth = 600;
    const roomHeight = 750;
    const wallThickness = 20;
    const doorWidth = 80;

    // Room 1
    this.createRoom(100, 100, roomWidth, roomHeight, wallThickness, doorWidth, "right");

    // Room 2 (right of Room 1)
    this.createRoom(100 + roomWidth, 100, roomWidth, roomHeight, wallThickness, doorWidth, "left-right");

    // Room 3 (right of Room 2)
    this.createRoom(100 + 2 * roomWidth, 100, roomWidth, roomHeight, wallThickness, doorWidth, "left");
  }

  createRoom(x: number, y: number, width: number, height: number, thickness: number, doorWidth: number, doorPosition: string) {
    // Top wall
    this.add(new Wall(this.scene, x, y, width, thickness, 0x00ff00));
    // Bottom wall
    this.add(new Wall(this.scene, x, y + height - thickness, width, thickness, 0x00ff00));

    // Left wall
    if (doorPosition !== "left" && doorPosition !== "left-right") {
      this.add(new Wall(this.scene, x, y, thickness, height, 0x00ff00));
    } else {
      // Left wall with a door in the middle
      this.add(new Wall(this.scene, x, y, thickness, (height - doorWidth) / 2, 0x00ff00)); // Top part
      this.add(new Wall(this.scene, x, y + height - (height - doorWidth) / 2, thickness, (height - doorWidth) / 2, 0x00ff00)); // Bottom part
    }

    // Right wall
    if (doorPosition !== "right" && doorPosition !== "left-right") {
      this.add(new Wall(this.scene, x + width - thickness, y, thickness, height, 0x00ff00));
    } else {
      // Right wall with a door in the middle
      this.add(new Wall(this.scene, x + width - thickness, y, thickness, (height - doorWidth) / 2, 0x00ff00)); // Top part
      this.add(new Wall(this.scene, x + width - thickness, y + height - (height - doorWidth) / 2, thickness, (height - doorWidth) / 2, 0x00ff00)); // Bottom part
    }
  }
}
