import { Schema, MapSchema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("int16") x: number;
  @type("int16") y: number;
}

export class RoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
