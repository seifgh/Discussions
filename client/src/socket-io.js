import { io } from "socket.io-client";
import { getAuthToken } from "./api";

export let socketIo;

export function connectWebsocket() {
  socketIo = io(process.env.WEBSOCKET_ENDPOINT || "ws://localhost:4000", {
    extraHeaders: {
      Authorization: getAuthToken()
    }
  });
}

export function closeWebsocket() {
  socketIo && socketIo.close();
}
