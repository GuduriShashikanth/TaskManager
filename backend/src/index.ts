import express, { Application } from "express";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { config, validateEnv } from "./config";
import { connectDB, disconnectDB } from "./utils";
import { errorHandler, notFoundHandler } from "./middlewares";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/task.routes";
import notificationRoutes from "./routes/notification.routes";
import { setupSocket } from "./sockets/socket";
import { initSocketService } from "./sockets/socket.service";

// Validate environment variables
validateEnv();

const app: Application = express();
const server = http.createServer(app);

// Socket.io setup
const io = new SocketServer(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

// Make io accessible to routes
app.set("io", io);

// Middleware
app.use(cors({ 
  origin: config.corsOrigin, 
  credentials: true 
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/tasks", taskRoutes);
// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler (must be last)
app.use(errorHandler);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
setupSocket(io);
initSocketService(io);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    
    server.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  server.close(async () => {
    console.log("HTTP server closed");
    await disconnectDB();
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer();

export { app, io };
