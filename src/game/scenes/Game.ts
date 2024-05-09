// Game.ts
import { Scene } from "phaser";
import Player from "../game-objects/Player";
import { EventBus } from "../EventBus";
import { EnemySpawner } from "../game-objects/EnemySpawner";
import { BackgroundGrid } from "../game-objects/BackgroundGrid";
import { RangedEnemy } from "../game-objects/RangedEnemy.ts";
import { MeleeEnemy } from "../game-objects/MeleeEnemy.ts";

export class Game extends Scene {
  player: Player;
  enemies: (RangedEnemy | MeleeEnemy)[];
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
    this.physics.world.timeScale = 1;

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);
    EventBus.emit("current-scene-ready", this);
    EventBus.emit('display-data', `Time Scale: ${this.physics.world.timeScale.toFixed(3)}`);

    this.backgroundGrid.initializeGraphics();

    const { meleeEnemies, rangedEnemies } = this.spawner.spawnEnemies(2);
    this.enemies = [...meleeEnemies, ...rangedEnemies];
    this.player = new Player(this, this.width / 2, this.height / 2, this.enemies);
    this.camera.startFollow(this.player.sprite, true, 0.09, 0.09);
  }

  update(time: number, delta: number) {
    this.backgroundGrid.draw();
    this.player.update(delta);
    this.enemies = this.enemies.filter((enemy) => !enemy.isDestroyed)
    this.enemies.forEach(enemy => enemy.update(delta, this.player, [...this.spawner.meleeEnemies, ...this.spawner.rangedEnemies]));
    EventBus.emit('display-data', `Time Scale: ${this.physics.world.timeScale.toFixed(3)}`);
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}
