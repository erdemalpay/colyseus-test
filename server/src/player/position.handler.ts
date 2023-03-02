import { RoomState } from "../types";

export interface Position {
  x: number;
  y: number;
}

const mapSize = { x: 800, y: 600 };

export class PositionHandler {
  private playerSpeed = 10;
  private positionsToGo = new Map<string, Position>();

  static getRandomPosition(): Position {
    return {
      x: Math.round(Math.random() * mapSize.x),
      y: Math.round(Math.random() * mapSize.y),
    };
  }

  static lerp(start: number, end: number, amt: number): number {
    return (1 - amt) * start + amt * end;
  }

  registerPosition(userId: string, position: Position) {
    this.positionsToGo.set(userId, position);
  }

  onTick(state: RoomState) {
    for (const userId of this.positionsToGo.keys()) {
      const player = state.players.get(userId);

      if (!player) {
        this.positionsToGo.delete(userId);
        continue;
      }

      const playerPositionToGo = this.positionsToGo.get(userId);

      if (!playerPositionToGo) {
        continue;
      }

      const angleToTarget = Math.atan2(
        playerPositionToGo.x - player.x,
        playerPositionToGo.y - player.y
      );

      if (angleToTarget === 0) {
        this.positionsToGo.delete(userId);
        continue;
      }

      const diffToTarget = Math.hypot(
        playerPositionToGo.x - player.x,
        playerPositionToGo.y - player.y
      );

      if (diffToTarget < this.playerSpeed) {
        player.x = playerPositionToGo.x;
        player.y = playerPositionToGo.y;
      } else {
        const stepX = Math.sin(angleToTarget) * this.playerSpeed;
        const stepY = Math.cos(angleToTarget) * this.playerSpeed;

        const newX = player.x + Math.round(stepX);
        const newY = player.y + Math.round(stepY);

        player.x = newX;
        player.y = newY;
      }

      state.players.set(userId, player);

      if (
        player.x === playerPositionToGo.x &&
        player.y === playerPositionToGo.y
      ) {
        this.positionsToGo.delete(userId);
      }
    }
  }
}
