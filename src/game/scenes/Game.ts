import { Scene } from "phaser";
import Player from "../game-objects/player";
import { MeleeEnemy, RangedEnemy } from "../game-objects/enemy";
import { EventBus } from "../EventBus.ts";

export class Game extends Scene {
    player: Player;
    camera: Phaser.Cameras.Scene2D.Camera;
    graphics: Phaser.GameObjects.Graphics;
    meleeEnemies: MeleeEnemy[] = [];
    rangedEnemies: RangedEnemy[] = [];
    bullets: Phaser.Physics.Arcade.Group;
    width: number = 1024; // Game width
    height: number = 768; // Game height
    gridSize: number = 32;

    constructor() {
        super('Game');
    }

    create() {
        this.physics.world.setBounds(0, 0, this.width, this.height);

        this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00, alpha: 0.4 } });


        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);
        EventBus.emit('current-scene-ready', this);
        this.bullets = this.physics.add.group({ classType: Phaser.GameObjects.Ellipse, runChildUpdate: true });

        for (let i = 0; i < 2; i++) {
            // Spawn at the edges
            const { x: mx, y: my } = this.getRandomEdgePosition();
            this.meleeEnemies.push(new MeleeEnemy(this, mx, my));

            const { x: rx, y: ry } = this.getRandomEdgePosition();
            this.rangedEnemies.push(new RangedEnemy(this, rx, ry, this.bullets));
        }
        const allEnemies = [...this.meleeEnemies, ...this.rangedEnemies];
        this.player = new Player(this, this.width / 2, this.height / 2, allEnemies);
        this.camera.startFollow(this.player.sprite, true, 0.09, 0.09);
    }

    update(time: number, delta: number) {
        const allEnemies = [...this.meleeEnemies, ...this.rangedEnemies];
        this.player.update(delta);
        this.drawBackground();

        this.meleeEnemies.forEach(enemy => enemy.update(delta, this.player, allEnemies));
        this.rangedEnemies.forEach(enemy => enemy.update(delta, this.player, allEnemies));
    }

    getRandomEdgePosition() {
        // Determine whether to spawn on a horizontal or vertical edge
        const spawnOnVerticalEdge = Phaser.Math.Between(0, 1) === 0;
        if (spawnOnVerticalEdge) {
            // Spawn on left or right edge
            const x = Phaser.Math.Between(0, 1) === 0 ? 0 : this.width;
            const y = Phaser.Math.Between(0, this.height);
            return { x, y };
        } else {
            // Spawn on top or bottom edge
            const x = Phaser.Math.Between(0, this.width);
            const y = Phaser.Math.Between(0, 1) === 0 ? 0 : this.height;
            return { x, y };
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


    changeScene() {
        this.scene.start('GameOver');
    }
}
