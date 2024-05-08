// Game.ts
import { Scene } from "phaser";
import Player from "../game-objects/Player";
import { EventBus } from "../EventBus";
import { EnemySpawner } from "../game-objects/EnemySpawner";
import { BackgroundGrid } from "../game-objects/BackgroundGrid";

export class Game extends Scene {
  player: Player;
  camera: Phaser.Cameras.Scene2D.Camera;
  spawner: EnemySpawner;
  backgroundGrid: BackgroundGrid;
  width: number = 1024;
  height: number = 768;
  gridSize: number = 32;

  constructor() {
    super("Game");
    this.spawner = new EnemySpawner(this, this.width, this.height);
    this.backgroundGrid = new BackgroundGrid(this, this.gridSize);
  }

  create() {
    this.physics.world.setBounds(0, 0, this.width, this.height);
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);
    EventBus.emit("current-scene-ready", this);

    this.backgroundGrid.initializeGraphics();

    const { meleeEnemies, rangedEnemies } = this.spawner.spawnEnemies(2);
    this.player = new Player(this, this.width / 2, this.height / 2, [...meleeEnemies, ...rangedEnemies]);
    this.camera.startFollow(this.player.sprite, true, 0.09, 0.09);
  }

  update(time: number, delta: number) {
    this.backgroundGrid.draw();
    this.player.update(delta);
    [...this.spawner.meleeEnemies, ...this.spawner.rangedEnemies].forEach(enemy => enemy.update(delta, this.player, [...this.spawner.meleeEnemies, ...this.spawner.rangedEnemies]));
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}
