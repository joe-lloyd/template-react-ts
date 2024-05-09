import { Scene } from "phaser";
import Player from "../game-objects/Player";
import { EventBus } from "../EventBus";
import { EnemySpawner } from "../game-objects/EnemySpawner";
import { BackgroundGrid } from "../game-objects/BackgroundGrid";
import { RangedEnemy } from "../game-objects/RangedEnemy";
import { MeleeEnemy } from "../game-objects/MeleeEnemy";
import { Bullet } from "../game-objects/Bullet"; // Ensure you have this import if Bullet is a class

export class Game extends Scene {
  player: Player;
  enemies: (RangedEnemy | MeleeEnemy)[];
  bullets: Phaser.GameObjects.Group; // Centralized group for all bullets
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
    this.bullets = this.add.group({ classType: Bullet, runChildUpdate: true }); // Initialize bullet group

    const { meleeEnemies, rangedEnemies } = this.spawner.spawnEnemies(2);
    this.enemies = [...meleeEnemies, ...rangedEnemies];
    this.player = new Player(this, this.width / 2, this.height / 2, this.enemies, this.bullets);
    this.camera.startFollow(this.player.sprite, true, 0.09, 0.09);
  }

  update(time: number, delta: number) {
    this.backgroundGrid.draw();
    this.player.update(delta);
    this.enemies.forEach(enemy => {
      enemy.update(delta, this.player, this.enemies);
      // Potentially handle enemy cleanup or specific behaviors here
    });
    this.enemies = this.enemies.filter(enemy => !enemy.isDestroyed);

    // Update and manage bullets globally
    this.bullets.getChildren().forEach(bullet => {
      bullet.update();
      // Additional logic for bullet update, if needed
      if (!bullet.active) {
        this.bullets.remove(bullet, true, true); // Remove inactive bullets
      }
    });

    EventBus.emit('display-data', `Time Scale: ${this.physics.world.timeScale.toFixed(3)}`);
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}
