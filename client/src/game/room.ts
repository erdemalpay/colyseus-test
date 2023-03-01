import * as Colyseus from "colyseus.js";
import { Position, RoomState } from "./game.types";

export class RoomClient {
  private client: Colyseus.Client;

  constructor() {
    this.client = new Colyseus.Client("ws://localhost:5678");
  }

  join(startingPosition: Position) {
    return this.client.joinOrCreate<RoomState>("map", startingPosition);
  }
}
