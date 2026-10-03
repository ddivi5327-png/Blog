import { io } from "socket.io-client";
import API_URL from "../api/api";

const socket = io(API_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("SOCKET CONNECTED:", socket.id);
});

socket.on("disconnect", () => {
  console.log("SOCKET DISCONNECTED");
});

socket.on("connect_error", (error) => {
  console.log("SOCKET CONNECTION ERROR:", error.message);
});

export default socket;
