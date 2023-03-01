import { Room } from "colyseus.js";
import { Scene } from "phaser";
import { RoomState } from "../../../server/src/room/room.state";
import { Position, Velocity } from "./game.types";
import { Keyboard, KeyboardAction } from "./keyboard";
import { Player } from "./player";
import { RoomClient } from "./room";

const roomClient = new RoomClient();

const startingPosition: Position = {
  x: 200,
  y: 200,
};

export class GameScene extends Scene {
  currentPlayer: Player | null = null;
  keyboard: Keyboard | null = null;
  room: Room<RoomState> | null = null;
  remotePlayers = new Map<string, Player>();
  constructor() {
    super("gameScene");
  }

  async create() {
    const log = this.add.text(10, 10, "Creating map...");
    this.room = await roomClient.join(startingPosition);
    this.createMap(this.room.sessionId);
    log.visible = false;

    this.room.onStateChange((state) => {
      for (const [sessionId, player] of state.players.entries()) {
        if (sessionId === this.currentPlayer?.sessionId) {
          this.currentPlayer.moveTo(player.x, player.y);
          continue;
        }

        const remotePlayer = this.remotePlayers.get(sessionId);

        if (remotePlayer) {
          remotePlayer.moveTo(player.x, player.y);
        } else {
          this.remotePlayers.set(
            sessionId,
            new Player(this, sessionId, player.x, player.y, 0.5)
          );
        }
      }
    });

    this.room.onMessage("playerLeave", (sessionId: string) => {
      const player = this.remotePlayers.get(sessionId);
      player?.destroy();
      this.remotePlayers.delete(sessionId);
    });
  }

  createMap(sessionId: string) {
    this.currentPlayer = new Player(
      this,
      sessionId,
      startingPosition.x,
      startingPosition.y
    );
    this.keyboard = new Keyboard(this);
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

  update() {
    this.updateCurrentPlayer();
  }

  updateCurrentPlayer() {
    if (!this.currentPlayer || !this.keyboard) return;

    const actions = this.keyboard.getActiveActions();
    const velocity: Velocity = {
      x: actions.includes(KeyboardAction.Left)
        ? -1
        : actions.includes(KeyboardAction.Right)
        ? 1
        : 0,
      y: actions.includes(KeyboardAction.Up)
        ? -1
        : actions.includes(KeyboardAction.Down)
        ? 1
        : 0,
    };

    this.room?.send("move", velocity);
    // Interpolation?
    this.currentPlayer.move({
      x: lerp(0, velocity.x, 0.1),
      y: lerp(0, velocity.y, 0.1),
    });
  }
}

function lerp(start: number, end: number, amt: number) {
  return (1 - amt) * start + amt * end;
}
