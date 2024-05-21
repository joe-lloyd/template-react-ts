import Phaser from "phaser";
import { Wall } from "./Wall";
import { Door } from "./Door";
import { GameLevel1 } from "../../scenes/GameLevel1";

interface RoomConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  enemies: { type: string, count: number }[];
}

interface DoorConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  roomIndex: number;
}

export class Map extends Phaser.Physics.Arcade.StaticGroup {
  rooms: RoomConfig[] = [];
  scene: GameLevel1;
  doors: DoorConfig[] = [];

  constructor(scene: GameLevel1) {
    super(scene.physics.world, scene);
    this.scene = scene;
  }

  createMapLayout() {
    const playAreaWidth = 1500;
    const playAreaHeight = 1500;
    const wallThickness = 20;
    const doorWidth = 80;

    // Create the outer play area
    this.createRoom(0, 0, 0, playAreaWidth, playAreaHeight, wallThickness, doorWidth, "", []);

    // Create four smaller rooms in each corner
    const roomWidth = 600;
    const roomHeight = 600;

    this.createRoom(1, 0, 0, roomWidth, roomHeight, wallThickness, doorWidth, "right", []);
    this.createRoom(2, playAreaWidth - roomWidth, 0, roomWidth, roomHeight, wallThickness, doorWidth, "left", [{
      type: "melee",
      count: 1,
    }]);
    this.createRoom(3, 0, playAreaHeight - roomHeight, roomWidth, roomHeight, wallThickness, doorWidth, "right", [{
      type: "ranged",
      count: 1,
    }]);
    this.createRoom(4, playAreaWidth - roomWidth, playAreaHeight - roomHeight, roomWidth, roomHeight, wallThickness, doorWidth, "left", [{
      type: "melee",
      count: 1,
    }]);
  }

  createRoom(
    roomIndex: number,
    x: number,
    y: number,
    width: number,
    height: number,
    thickness: number,
    doorWidth: number,
    doorPosition: string,
    enemies: { type: string, count: number }[],
  ) {
    // Top and bottom walls
    this.add(new Wall(this.scene, x, y, width, thickness, 0x00ff00));
    this.add(new Wall(this.scene, x, y + height - thickness, width, thickness, 0x00ff00));

    // Left wall
    if (doorPosition === "left" || doorPosition === "left-right") {
      this.add(new Wall(this.scene, x, y, thickness, (height - doorWidth) / 2, 0x00ff00)); // Top part
      this.add(new Wall(this.scene, x, y + height - (height - doorWidth) / 2, thickness, (height - doorWidth) / 2, 0x00ff00)); // Bottom part
      this.doors.push({
        x: x,
        y: y + (height - doorWidth) / 2,
        width: thickness,
        height: doorWidth,
        roomIndex: roomIndex,
      });
    } else {
      this.add(new Wall(this.scene, x, y, thickness, height, 0x00ff00));
    }

    // Right wall
    if (doorPosition === "right" || doorPosition === "left-right") {
      this.add(new Wall(this.scene, x + width - thickness, y, thickness, (height - doorWidth) / 2, 0x00ff00)); // Top part
      this.add(new Wall(this.scene, x + width - thickness, y + height - (height - doorWidth) / 2, thickness, (height - doorWidth) / 2, 0x00ff00)); // Bottom part
      this.doors.push({
        x: x + width - thickness,
        y: y + (height - doorWidth) / 2,
        width: thickness,
        height: doorWidth,
        roomIndex: roomIndex,
      });
    } else {
      this.add(new Wall(this.scene, x + width - thickness, y, thickness, height, 0x00ff00));
    }

    this.rooms.push({ x, y, width, height, enemies });
    console.log(`Room created at (${x}, ${y}) with width ${width} and height ${height}`);
  }

  createDoors() {
    this.doors.forEach(doorConfig => {
      const door = new Door(this.scene, doorConfig.x, doorConfig.y, doorConfig.roomIndex);
      this.scene.add.existing(door);
    });
  }
}
