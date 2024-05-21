import { EnemySpawner } from "../game-objects/EnemySpawner";
import { BackgroundGrid } from "../game-objects/BackgroundGrid";
import { Bullet } from "../game-objects/Bullet";
import { MeleeEnemy } from "../game-objects/MeleeEnemy.ts";
import { RangedEnemy } from "../game-objects/RangedEnemy.ts";
import { Wall } from "../game-objects/Wall.tsx";
import { BaseGame } from "./BaseGame.ts";
import Player from "../game-objects/Player.ts";

export class GameLevel1 extends BaseGame {
  walls: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super("GameLevel1");
    this.backgroundGrid = new BackgroundGrid(this, this.gridSize);
  }

  create() {
    super.create();

    this.walls = this.physics.add.staticGroup();
    this.createMapLayout();

    this.player = new Player(this, this.width / 2, this.height / 2);
    this.camera.startFollow(this.player, true, 0.09, 0.09);
    this.player.addToScene();

    this.spawner = new EnemySpawner(this);
    this.bullets = this.add.group({ classType: Bullet, runChildUpdate: true });
    this.spawner.spawnEnemies(3);

    this.meleeEnemies = this.spawner.meleeEnemies.getChildren() as MeleeEnemy[];
    this.rangedEnemies = this.spawner.rangedEnemies.getChildren() as RangedEnemy[];
  }

  createMapLayout() {
    // Adjusted room dimensions
    const roomWidth = 800;
    const roomHeight = 1000;
    const wallThickness = 20;
    const doorWidth = 80;

    // Room 1
    this.createRoom(100, 100, roomWidth, roomHeight, wallThickness, doorWidth, "right");

    // Room 2 (right of Room 1)
    this.createRoom(100 + roomWidth + wallThickness, 100, roomWidth, roomHeight, wallThickness, doorWidth, "left-right");

    // Room 3 (right of Room 2)
    this.createRoom(100 + 2 * (roomWidth + wallThickness), 100, roomWidth, roomHeight, wallThickness, doorWidth, "left");
  }

  createRoom(x: number, y: number, width: number, height: number, thickness: number, doorWidth: number, doorPosition: string) {
    // Top wall
    this.walls.add(new Wall(this, x, y, width, thickness, 0x00ff00));
    // Bottom wall
    this.walls.add(new Wall(this, x, y + height - thickness, width, thickness, 0x00ff00));

    // Left wall
    if (doorPosition !== "left" && doorPosition !== "left-right") {
      this.walls.add(new Wall(this, x, y, thickness, height, 0x00ff00));
    } else {
      // Left wall with a door in the middle
      this.walls.add(new Wall(this, x, y, thickness, (height - doorWidth) / 2, 0x00ff00)); // Top part
      this.walls.add(new Wall(this, x, y + height - (height - doorWidth) / 2, thickness, (height - doorWidth) / 2, 0x00ff00)); // Bottom part
    }

    // Right wall
    if (doorPosition !== "right" && doorPosition !== "left-right") {
      this.walls.add(new Wall(this, x + width - thickness, y, thickness, height, 0x00ff00));
    } else {
      // Right wall with a door in the middle
      this.walls.add(new Wall(this, x + width - thickness, y, thickness, (height - doorWidth) / 2, 0x00ff00)); // Top part
      this.walls.add(new Wall(this, x + width - thickness, y + height - (height - doorWidth) / 2, thickness, (height - doorWidth) / 2, 0x00ff00)); // Bottom part
    }
  }

  update(_time: number, delta: number) {
    super.update(_time, delta);

    this.meleeEnemies.forEach(enemy => {
      enemy.update(_time, delta);
    });

    this.rangedEnemies.forEach(enemy => {
      enemy.update(_time, delta);
    });

    this.bullets.getChildren().forEach(bullet => {
      if (!bullet.active) {
        this.bullets.remove(bullet, true, true);
      }
    });
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}
