import * as Colyseus from "colyseus.js";
import { RoomState } from "./game.types";

export class RoomClient {
  private client: Colyseus.Client;

  constructor() {
    this.client = new Colyseus.Client(
      `ws://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`
    );
  }

  join(userId: string) {
    return this.client.joinOrCreate<RoomState>("map", userId);
  }
}
