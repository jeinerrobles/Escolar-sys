import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticateJWT, authorizeRoles("admin"), UsuarioController.getAll);
router.get("/:id", authenticateJWT, authorizeRoles("admin"), UsuarioController.getOne);
router.post("/", authenticateJWT, authorizeRoles("admin"), UsuarioController.create);
router.put("/:id", authenticateJWT, authorizeRoles("admin"), UsuarioController.update);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), UsuarioController.delete);

export default router;
