import { Scene } from "phaser";
import Player from "../game-objects/player.ts";
import { MeleeEnemy, RangedEnemy } from "../game-objects/enemy.ts";
import { EventBus } from "../EventBus.ts";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    player: Player;
    gridSize: number = 32;
    graphics: Phaser.GameObjects.Graphics;
    meleeEnemies: MeleeEnemy[] = [];
    rangedEnemies: RangedEnemy[] = [];

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);
        this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00, alpha: 0.4 } });
        this.player = new Player(this, 512, 384);
        this.camera.startFollow(this.player.sprite, true, 0.09, 0.09);
        EventBus.emit('current-scene-ready', this);

        for (let i = 0; i < 5; i++) {
            this.meleeEnemies.push(new MeleeEnemy(this, Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500)));
            this.rangedEnemies.push(new RangedEnemy(this, Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500)));
        }
    }

    drawBackground() {
        this.graphics.clear();

        // Get the top-left corner of the visible area
        const topLeftX = Math.floor(this.camera.worldView.left / this.gridSize) * this.gridSize;
        const topLeftY = Math.floor(this.camera.worldView.top / this.gridSize) * this.gridSize;

        // Get the bottom-right corner of the visible area
        const bottomRightX = this.camera.worldView.right;
        const bottomRightY = this.camera.worldView.bottom;

        // Draw vertical lines
        for (let x = topLeftX; x <= bottomRightX; x += this.gridSize) {
            this.graphics.lineBetween(x, topLeftY, x, bottomRightY);
        }

        // Draw horizontal lines
        for (let y = topLeftY; y <= bottomRightY; y += this.gridSize) {
            this.graphics.lineBetween(topLeftX, y, bottomRightX, y);
        }
    }

    update() {
        this.player.update(this.game.loop.delta);
        this.drawBackground();
        this.meleeEnemies.forEach(enemy => enemy.update(this.game.loop.delta, this.player));
        this.rangedEnemies.forEach(enemy => enemy.update(this.game.loop.delta, this.player));
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}
