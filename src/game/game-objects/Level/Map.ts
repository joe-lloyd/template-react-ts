import Phaser from 'phaser';
import { Wall } from "./Wall.ts";
import { Door } from "./Door.ts";
import { GameLevel1 } from "../../scenes/GameLevel1.ts";

interface RoomConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  enemies: { type: string, count: number }[];
}

export class Map extends Phaser.Physics.Arcade.StaticGroup {
  rooms: RoomConfig[] = [];
  doors: Door[] = [];
  scene: GameLevel1;

  constructor(scene: GameLevel1) {
    super(scene.physics.world, scene);
    this.scene = scene;
  }

  createMapLayout() {
    const roomWidth = 600;
    const roomHeight = 750;
    const wallThickness = 20;
    const doorWidth = 80;

    this.createRoom(100, 100, roomWidth, roomHeight, wallThickness, doorWidth, "right", []);
    this.createRoom(100 + roomWidth, 100, roomWidth, roomHeight, wallThickness, doorWidth, "left-right", [
      { type: 'melee', count: 2 },
      { type: 'ranged', count: 1 }
    ]);
    this.createRoom(100 + 2 * roomWidth, 100, roomWidth, roomHeight, wallThickness, doorWidth, "left", [
      { type: 'melee', count: 3 },
      { type: 'ranged', count: 2 }
    ]);
  }

  createRoom(
    x: number,
    y: number,
    width: number,
    height: number,
    thickness: number,
    doorWidth: number,
    doorPosition: string,
    enemies: { type: string, count: number }[]
  ) {
    this.add(new Wall(this.scene, x, y, width, thickness, 0x00ff00));
    this.add(new Wall(this.scene, x, y + height - thickness, width, thickness, 0x00ff00));

    if (doorPosition === "left" || doorPosition === "left-right") {
      this.add(new Wall(this.scene, x, y, thickness, (height - doorWidth) / 2, 0x00ff00)); // Top part
      this.add(new Wall(this.scene, x, y + height - (height - doorWidth) / 2, thickness, (height - doorWidth) / 2, 0x00ff00)); // Bottom part
    } else {
      this.add(new Wall(this.scene, x, y, thickness, height, 0x00ff00));
    }

    if (doorPosition === "right" || doorPosition === "left-right") {
      this.add(new Wall(this.scene, x + width - thickness, y, thickness, (height - doorWidth) / 2, 0x00ff00)); // Top part
      this.add(new Wall(this.scene, x + width - thickness, y + height - (height - doorWidth) / 2, thickness, (height - doorWidth) / 2, 0x00ff00)); // Bottom part
    } else {
      this.add(new Wall(this.scene, x + width - thickness, y, thickness, height, 0x00ff00));
    }

    this.rooms.push({ x, y, width, height, enemies });
    console.log(`Room created at (${x}, ${y}) with width ${width} and height ${height}`);
  }

  createDoors() {
    for (let i = 0; i < this.rooms.length - 1; i++) {
      const room = this.rooms[i];
      const doorX = room.x + room.width;
      const doorY = room.y + room.height / 2;
      const door = new Door(this.scene, doorX, doorY, i);
      this.doors.push(door);
    }
  }
}
