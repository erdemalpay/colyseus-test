import { PositionHandler, type Position } from "../player/position.handler";
import { Room, Client } from "colyseus";
import { Player } from "../player/player.schema";
import { RoomState } from "./room.state";

export class MyMap extends Room<RoomState> {
  private positionHandler = new PositionHandler();

  onCreate() {
    this.setState(new RoomState());
    this.clock.start();

    this.clock.setInterval(() => {
      this.positionHandler.onTick(this.state);
    }, 50);

    this.onMessage("moveTo", (client, position: Position) => {
      const userId = client.userData.userId;
      const player = this.state.players.get(userId);

      if (!player) return; // TODO: Is it possible?

      this.positionHandler.registerPosition(userId, position);
    });
  }

  onJoin(client: Client, userId: string) {
    const position = PositionHandler.getRandomPosition();
    this.state.players.set(userId, new Player({ ...position, moving: false }));
    client.userData = { userId };

    client.send("initialPosition", position);
  }

  onLeave(client: Client) {
    const userId = client.userData.userId;

    if (this.state.players.has(userId)) {
      this.state.players.delete(userId);
      this.broadcast("playerLeave", userId);
    }
  }
}
