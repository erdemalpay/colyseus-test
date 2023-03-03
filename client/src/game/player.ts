import { GameObjects, Scene } from "phaser";

export class Player {
  private shape: GameObjects.Arc;
  private size = 10;

  constructor(scene: Scene, x: number, y: number, fillAlpha?: number) {
    this.shape = scene.add.circle(x, y, this.size, 0xffffff, fillAlpha);
    this.shape.setData("moving", false);
  }

  get moving() {
    return this.shape.data.get("moving");
  }

  getShape() {
    return this.shape;
  }

  moveTo(x: number, y: number, moving: boolean) {
    this.shape.x = x;
    this.shape.y = y;
    this.shape.data.set("moving", moving);
  }

  destroy() {
    this.shape.destroy();
  }
}
