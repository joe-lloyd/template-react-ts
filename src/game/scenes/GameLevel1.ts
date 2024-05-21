import { EnemySpawner } from "../game-objects/Characters/EnemySpawner.ts";
import { BackgroundGrid } from "../game-objects/Level/BackgroundGrid.ts";
import { Bullet } from "../game-objects/Characters/Bullet.ts";
import { MeleeEnemy } from "../game-objects/Characters/MeleeEnemy.ts";
import { RangedEnemy } from "../game-objects/Characters/RangedEnemy.ts";
import { Map } from "../game-objects/Level/Map.ts";
import { BaseGame } from "./BaseGame.ts";
import Player from "../game-objects/Characters/Player.ts";

export class GameLevel1 extends BaseGame {
  walls: Phaser.Physics.Arcade.StaticGroup;
  map: Map;

  constructor() {
    super("GameLevel1");
    this.backgroundGrid = new BackgroundGrid(this, this.gridSize);
  }

  create() {
    super.create();

    this.map = new Map(this);
    this.map.createMapLayout();

    this.player = new Player(this, this.width / 2, this.height / 2);
    this.camera.startFollow(this.player, true, 0.09, 0.09);
    this.player.addToScene();

    // Collide player with walls
    this.physics.add.collider(this.player, this.map);

    this.spawner = new EnemySpawner(this);
    this.bullets = this.add.group({ classType: Bullet, runChildUpdate: true });
    this.spawner.spawnEnemies(3);

    this.meleeEnemies = this.spawner.meleeEnemies.getChildren() as MeleeEnemy[];
    this.rangedEnemies = this.spawner.rangedEnemies.getChildren() as RangedEnemy[];

    // Collide enemies with walls
    this.meleeEnemies.forEach(enemy => {
      this.physics.add.collider(enemy, this.map);
    });

    this.rangedEnemies.forEach(enemy => {
      this.physics.add.collider(enemy, this.map);
    });
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
