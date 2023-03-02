import { Room, Client } from "colyseus.js";
import { v4 as uuidv4 } from "uuid";
import { PositionHandler } from "./player/position.handler";
import { Position } from "./types";

export function requestJoinOptions(this: Client, i: number) {
  return uuidv4();
}

export function onJoin(this: Room) {
  let position: Position;

  this.onMessage("initialPosition", (pos) => {
    position = pos;
  });

  this.onMessage("playerLeave", () => {});

  setInterval(() => {
    if (!position) return;

    this.send("moveTo", PositionHandler.getRandomPosition());
  }, 2000);
}

export function onLeave(this: Room) {
  // console.log(this.sessionId, "left.");
}

export function onError(this: Room, err) {
  console.error(this.sessionId, "!! ERROR !!", err.message);
}

// export function onStateChange(this: Room, state) {}
