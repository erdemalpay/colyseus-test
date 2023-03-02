import { Schema, MapSchema, type } from "@colyseus/schema";
import { Player } from "../player/player.schema";

export class RoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
