import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("int16") x: number;
  @type("int16") y: number;
  @type("boolean") moving: boolean;
}
