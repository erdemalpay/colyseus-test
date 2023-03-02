import { GameObjects, Scene } from "phaser";
import { Position } from "./game.types";

export class Player {
  private shape: GameObjects.Arc;
  private size = 10;

  constructor(scene: Scene, x: number, y: number, fillAlpha?: number) {
    this.shape = scene.add.circle(x, y, this.size, 0xffffff, fillAlpha);
  }

  getShape() {
    return this.shape;
  }

  moveTo(x: number, y: number) {
    this.shape.x = x;
    this.shape.y = y;
  }

  destroy() {
    this.shape.destroy();
  }

  getPosition(): Position {
    return {
      x: this.shape.x,
      y: this.shape.y,
    };
  }
}
