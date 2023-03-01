import { Room, Client } from "colyseus";
import { Player, RoomState } from "./room.state";

interface Position {
  x: number;
  y: number;
}

export class MyMap extends Room<RoomState> {
  private playerSpeed = 3;

  onCreate() {
    this.setState(new RoomState());

    this.onMessage("move", (client, velocity: { x: number; y: number }) => {
      const player = this.state.players.get(client.sessionId);

      if (!player) return; // TODO: Is it possible?

      player.x += velocity.x ? velocity.x * this.playerSpeed : 0;
      player.y += velocity.y ? velocity.y * this.playerSpeed : 0;

      this.state.players.set(client.sessionId, player);
    });
  }

  onJoin(client: Client, options: Position) {
    this.state.players.set(
      client.sessionId,
      new Player({ x: options.x, y: options.y })
    );
  }

  onLeave(client: Client) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId);
      this.broadcast("playerLeave", client.sessionId);
    }
  }
}
