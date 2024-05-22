import { EnemySpawner } from '../game-objects/Characters/EnemySpawner';
import { Bullet } from '../game-objects/Characters/Bullet';
import { MeleeEnemy } from '../game-objects/Characters/MeleeEnemy';
import { RangedEnemy } from '../game-objects/Characters/RangedEnemy';
import { Map } from '../game-objects/Level/Map';
import { BaseGame } from './BaseGame';
import Player from '../game-objects/Characters/Player';

export class GameLevel1 extends BaseGame {
  map: Map;

  constructor() {
    super('GameLevel1');
  }

  create() {
    super.create();

    this.map = new Map(this);
    this.map.createMapLayout();

    this.player = new Player(this, this.width / 2, this.height / 2);
    this.camera.startFollow(this.player, true, 0.09, 0.09);
    this.player.addToScene();

    this.map.createDoors();

    this.spawner = new EnemySpawner(this);
    this.bullets = this.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });

    this.meleeEnemies = this.spawner.meleeEnemies.getChildren() as MeleeEnemy[];
    this.rangedEnemies =
      this.spawner.rangedEnemies.getChildren() as RangedEnemy[];
  }

  update(_time: number, delta: number) {
    super.update(_time, delta);
    this.player.update(_time, delta);

    this.meleeEnemies.forEach((enemy) => {
      enemy.update(_time, delta);
    });

    this.rangedEnemies.forEach((enemy) => {
      enemy.update(_time, delta);
    });

    this.bullets.getChildren().forEach((bullet) => {
      if (!bullet.active) {
        this.bullets.remove(bullet, true, true);
      }
    });
  }

  changeScene() {
    this.scene.start('GameOver');
  }
}
