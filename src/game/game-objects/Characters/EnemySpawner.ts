import { MeleeEnemy } from "./MeleeEnemy.ts";
import { RangedEnemy } from "./RangedEnemy.ts";
import { GameLevel1 } from "../../scenes/GameLevel1.ts";

export class EnemySpawner {
  scene: GameLevel1;
  meleeEnemies: Phaser.Physics.Arcade.Group;
  rangedEnemies: Phaser.Physics.Arcade.Group;

  constructor(scene: GameLevel1) {
    this.scene = scene;

    // Create groups with default settings, adjust as needed
    this.meleeEnemies = this.scene.physics.add.group({
      classType: MeleeEnemy,
      runChildUpdate: true // This allows the update method on each MeleeEnemy to be called automatically
    });
    this.rangedEnemies = this.scene.physics.add.group({
      classType: RangedEnemy,
      runChildUpdate: true
    });
  }

  spawnEnemies(numEnemies: number) {
    for (let i = 0; i < numEnemies; i++) {
      const { x: mx, y: my } = this.getRandomEdgePosition();
      const melee = new MeleeEnemy(this.scene, mx, my);
      melee.addToScene();
      this.meleeEnemies.add(melee);

      const { x: rx, y: ry } = this.getRandomEdgePosition();
      const ranged = new RangedEnemy(this.scene, rx, ry);
      this.rangedEnemies.add(ranged);
      ranged.addToScene();
    }
  }

  getRandomEdgePosition() {
    const spawnOnVerticalEdge = Phaser.Math.Between(0, 1) === 0;
    if (spawnOnVerticalEdge) {
      const x = Phaser.Math.Between(0, 1) === 0 ? 0 : this.scene.scale.width;
      const y = Phaser.Math.Between(0, this.scene.scale.height);
      return { x, y };
    } else {
      const x = Phaser.Math.Between(0, this.scene.scale.width);
      const y = Phaser.Math.Between(0, 1) === 0 ? 0 : this.scene.scale.height;
      return { x, y };
    }
  }
}
