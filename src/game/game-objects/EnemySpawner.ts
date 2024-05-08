// EnemySpawner.ts
import { Scene } from "phaser";
import { MeleeEnemy } from "./MeleeEnemy";
import { RangedEnemy } from "./RangedEnemy";

export class EnemySpawner {
  scene: Scene;
  meleeEnemies: MeleeEnemy[] = [];
  rangedEnemies: RangedEnemy[] = [];
  width: number;
  height: number;

  constructor(scene: Scene, width: number, height: number) {
    this.scene = scene;
    this.width = width;
    this.height = height;
  }

  spawnEnemies(numEnemies: number): { meleeEnemies: MeleeEnemy[], rangedEnemies: RangedEnemy[] } {
    for (let i = 0; i < numEnemies; i++) {
      const { x: mx, y: my } = this.getRandomEdgePosition();
      this.meleeEnemies.push(new MeleeEnemy(this.scene, mx, my));

      const { x: rx, y: ry } = this.getRandomEdgePosition();
      this.rangedEnemies.push(new RangedEnemy(this.scene, rx, ry));
    }
    return {
      meleeEnemies: this.meleeEnemies,
      rangedEnemies: this.rangedEnemies
    };
  }

  getRandomEdgePosition() {
    const spawnOnVerticalEdge = Phaser.Math.Between(0, 1) === 0;
    if (spawnOnVerticalEdge) {
      const x = Phaser.Math.Between(0, 1) === 0 ? 0 : this.width;
      const y = Phaser.Math.Between(0, this.height);
      return { x, y };
    } else {
      const x = Phaser.Math.Between(0, this.width);
      const y = Phaser.Math.Between(0, 1) === 0 ? 0 : this.height;
      return { x, y };
    }
  }
}
