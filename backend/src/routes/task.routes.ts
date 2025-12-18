import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { create, update, remove, list } from "../controllers/task.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", create);
router.get("/", list);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
