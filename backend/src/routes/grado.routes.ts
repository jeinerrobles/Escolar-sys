import { Router } from "express";
import { GradoController } from "../controllers/grado.controller";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticateJWT, authorizeRoles("admin"), GradoController.getAll);
router.get("/:id", authenticateJWT, authorizeRoles("admin"), GradoController.getById);
router.post("/", authenticateJWT, authorizeRoles("admin"), GradoController.create);
router.put("/:id", authenticateJWT, authorizeRoles("admin"), GradoController.update);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), GradoController.delete);

export default router;
