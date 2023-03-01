import { Server } from "colyseus";
import { MyMap } from "./room";

const port = parseInt(process.env.PORT, 10) || 5678;

const gameServer = new Server();
gameServer.define("map", MyMap);
if (process.env.NODE_ENV !== "production") {
  gameServer.simulateLatency(200);
}
gameServer.listen(port);
console.log(`[GameServer] Listening on Port: ${port}`);
