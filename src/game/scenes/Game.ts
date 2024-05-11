import { Scene } from "phaser";
import Player from "../game-objects/Player";
import { EventBus } from "../EventBus";
import { EnemySpawner } from "../game-objects/EnemySpawner";
import { BackgroundGrid } from "../game-objects/BackgroundGrid";
import { Bullet } from "../game-objects/Bullet";

export class Game extends Scene {
  player: Player;
  bullets: Phaser.GameObjects.Group;
  camera: Phaser.Cameras.Scene2D.Camera;
  spawner: EnemySpawner;
  backgroundGrid: BackgroundGrid;
  width: number = 1024;
  height: number = 768;
  gridSize: number = 32;

  constructor() {
    super("Game");
    this.backgroundGrid = new BackgroundGrid(this, this.gridSize);
  }

  create() {
    this.physics.world.setBounds(0, 0, this.width, this.height);
    this.physics.world.timeScale = 1;

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);
    EventBus.emit("current-scene-ready", this);
    EventBus.emit("display-data", `Time Scale: ${this.physics.world.timeScale.toFixed(3)}`);

    this.backgroundGrid.initializeGraphics();

    console.log('Scene initialized:', this.sys); // Should be true
    console.log('Physics world initialized:', this.physics.world); // Should be true



    this.spawner = new EnemySpawner(this);
    this.bullets = this.add.group({ classType: Bullet, runChildUpdate: true });
    this.spawner.spawnEnemies(2); // Spawn enemies directly into their respective groups

    this.player = new Player(this, this.width / 2, this.height / 2);
    this.camera.startFollow(this.player, true, 0.09, 0.09);
    this.player.addToScene();
  }

  update(_time: number, delta: number) {
    this.backgroundGrid.draw();
    this.player.update(delta);

    // Update melee and ranged enemies
    this.spawner.meleeEnemies.getChildren().forEach(enemy => {
      enemy.update(delta);
    });
    this.spawner.rangedEnemies.getChildren().forEach(enemy => {
      enemy.update(delta);
    });

    // Update and manage bullets globally
    this.bullets.getChildren().forEach(bullet => {
      // Assuming bullets have an update method
      if (!bullet.active) {
        this.bullets.remove(bullet, true, true); // Remove inactive bullets
      }
    });

    EventBus.emit("display-data", `Time Scale: ${this.physics.world.timeScale.toFixed(3)}`);
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}
