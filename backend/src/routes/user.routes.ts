import { Router } from "express";
import { getMe, updateMe, getUsers } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/me", getMe);
router.put("/me", updateMe);
router.get("/", getUsers);

export default router;
