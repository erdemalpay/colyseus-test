import { GameObjects, Scene } from "phaser";
import { Position, Velocity } from "./game.types";

export class Player {
  private shape: GameObjects.Arc;
  private speed = 3;
  private size = 10;

  constructor(
    scene: Scene,
    public sessionId: string,
    x: number,
    y: number,
    fillAlpha?: number
  ) {
    this.shape = scene.add.circle(x, y, this.size, 0xffffff, fillAlpha);
  }

  getShape() {
    return this.shape;
  }

  move(velocity: Velocity) {
    this.shape.x += velocity.x ? velocity.x * this.speed : 0;
    this.shape.y += velocity.y ? velocity.y * this.speed : 0;
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
