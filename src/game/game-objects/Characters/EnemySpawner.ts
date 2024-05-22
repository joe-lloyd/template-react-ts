import { MeleeEnemy } from './MeleeEnemy';
import { RangedEnemy } from './RangedEnemy';
import { GameLevel1 } from '../../scenes/GameLevel1';

export class EnemySpawner {
  scene: GameLevel1;

  meleeEnemies: Phaser.Physics.Arcade.Group;

  rangedEnemies: Phaser.Physics.Arcade.Group;

  constructor(scene: GameLevel1) {
    this.scene = scene;

    // Create groups with default settings, adjust as needed
    this.meleeEnemies = this.scene.physics.add.group({
      classType: MeleeEnemy,
      runChildUpdate: true, // This allows the update method on each MeleeEnemy to be called automatically
    });
    this.rangedEnemies = this.scene.physics.add.group({
      classType: RangedEnemy,
      runChildUpdate: true,
    });
  }

  spawnEnemies(roomConfig: {
    x: number;
    y: number;
    width: number;
    height: number;
    enemies: { type: string; count: number }[];
  }) {
    if (!roomConfig || !roomConfig.enemies) {
      return;
    }

    roomConfig.enemies.forEach((enemyConfig) => {
      for (let i = 0; i < enemyConfig.count; i++) {
        const { x, y } = this.getRandomPositionInRoom(roomConfig);
        if (enemyConfig.type === 'melee') {
          const melee = new MeleeEnemy(this.scene, x, y);
          melee.addToScene();
          this.meleeEnemies.add(melee);
        } else if (enemyConfig.type === 'ranged') {
          const ranged = new RangedEnemy(this.scene, x, y);
          ranged.addToScene();
          this.rangedEnemies.add(ranged);
        }
      }
    });
  }

  getRandomPositionInRoom(room: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    const x = Phaser.Math.Between(room.x, room.x + room.width);
    const y = Phaser.Math.Between(room.y, room.y + room.height);
    return { x, y };
  }
}
