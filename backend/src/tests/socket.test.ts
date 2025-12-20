import { io } from "socket.io-client";

const socket = io("https://taskmanager-ddip.onrender.com", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("taskUpdated", (data) => {
  console.log("📢 taskUpdated event received:", data);
});

socket.on("taskAssigned", (data) => {
  console.log("📢 taskAssigned event received:", data);
});
