import Phaser from "phaser";
import { GameScene } from "./scene";

const config: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [GameScene],
};

export class Game extends Phaser.Game {
  constructor() {
    super(config);
  }
}
