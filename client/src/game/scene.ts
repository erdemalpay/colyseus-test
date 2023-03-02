import { Room } from "colyseus.js";
import { Scene, Input } from "phaser";
import { RoomState } from "../../../server/src/room/room.state";
import { Position } from "./game.types";
import { Player } from "./player";
import { RoomClient } from "./room";
import { v4 as uuidv4 } from "uuid";

const roomClient = new RoomClient();

const getUserId = () => {
  let userId = window.localStorage.getItem("userId");

  if (userId) {
    return userId;
  }

  userId = uuidv4();
  window.localStorage.setItem("userId", userId);

  return userId;
};

export class GameScene extends Scene {
  currentPlayer: Player | null = null;
  room: Room<RoomState> | null = null;
  remotePlayers = new Map<string, Player>();
  userId = getUserId();

  constructor() {
    super("gameScene");
  }

  async create() {
    const log = this.add.text(10, 10, "Creating map...");
    this.room = await roomClient.join(this.userId);
    this.createMap();
    log.visible = false;

    this.input.on(Input.Events.POINTER_DOWN, (pointer: Input.Pointer) => {
      this.room?.send("moveTo", { x: pointer.worldX, y: pointer.worldY });
    });

    this.room.onMessage("initialPosition", (position: Position) => {
      this.createCurrentPlayer(position);
    });

    this.room.onMessage("playerLeave", (userId: string) => {
      const player = this.remotePlayers.get(userId);
      player?.destroy();
      this.remotePlayers.delete(userId);
    });

    this.room.onStateChange((state) => {
      for (const [userId, player] of state.players.entries()) {
        if (userId === this.userId) {
          this.currentPlayer?.moveTo(player.x, player.y);
          continue;
        }

        const remotePlayer = this.remotePlayers.get(userId);

        if (remotePlayer) {
          remotePlayer.moveTo(player.x, player.y);
        } else {
          this.remotePlayers.set(
            userId,
            new Player(this, player.x, player.y, 0.5)
          );
        }
      }
    });
  }

  createMap() {
    this.add.grid(
      0,
      0,
      this.game.canvas.width * 2,
      this.game.canvas.height * 2,
      32,
      32,
      0x000000,
      0,
      0xffffff,
      0.12
    );
  }

  createCurrentPlayer(position: Position) {
    this.currentPlayer = new Player(this, position.x, position.y);
  }

  update() {}
}

// function lerp(start: number, end: number, amt: number) {
//   return (1 - amt) * start + amt * end;
// }
