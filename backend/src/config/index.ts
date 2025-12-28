import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "https://cotask.netlify.app" || "https://task-manager-beta-seven-73.vercel.app" || "https://task-manager-shashis-projects-637872b6.vercel.app",
};

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"] as const;

export const validateEnv = (): void => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};
