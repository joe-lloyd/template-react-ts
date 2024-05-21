// BackgroundGrid.ts
import { Scene, GameObjects } from "phaser";

export class BackgroundGrid {
  scene: Scene;
  graphics: GameObjects.Graphics | null = null;
  gridSize: number;

  constructor(scene: Scene, gridSize: number) {
    this.scene = scene;
    this.gridSize = gridSize;
  }

  initializeGraphics() {
    this.graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00, alpha: 0.4 } });
  }

  draw() {
    if (!this.graphics) {
      console.error("Graphics not initialized");
      return;
    }

    this.graphics.clear();
    const camera = this.scene.cameras.main;
    const topLeftX = Math.floor(camera.worldView.left / this.gridSize) * this.gridSize;
    const topLeftY = Math.floor(camera.worldView.top / this.gridSize) * this.gridSize;
    const bottomRightX = camera.worldView.right;
    const bottomRightY = camera.worldView.bottom;

    for (let x = topLeftX; x <= bottomRightX; x += this.gridSize) {
      this.graphics.lineBetween(x, topLeftY, x, bottomRightY);
    }

    for (let y = topLeftY; y <= bottomRightY; y += this.gridSize) {
      this.graphics.lineBetween(topLeftX, y, bottomRightX, y);
    }
  }
}
