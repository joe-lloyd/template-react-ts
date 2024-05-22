import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
  background: GameObjects.Image;

  logo: GameObjects.Image;

  title: GameObjects.Text;

  logoTween: Phaser.Tweens.Tween | null;

  constructor() {
    super('MainMenu');
  }

  create() {
    this.input.gamepad?.once('down', this.changeScene, this);
    this.background = this.add.image(512, 384, 'background');

    this.logo = this.add.image(512, 300, 'logo').setDepth(100);

    this.title = this.add
      .text(512, 460, 'Main Menu', {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(100);

    EventBus.emit('current-scene-ready', this);
  }

  changeScene() {
    if (this.logoTween) {
      this.logoTween.stop();
      this.logoTween = null;
    }

    this.input.gamepad?.off('down', this.changeScene, this);
    this.scene.start('GameLevel1');
  }
}
