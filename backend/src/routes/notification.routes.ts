import { Router } from "express";
import {
  getMyNotifications,
  markNotificationRead,
} from "../controllers/notification.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getMyNotifications);
router.patch("/:id/read", markNotificationRead);

export default router;
