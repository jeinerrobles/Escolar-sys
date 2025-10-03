import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// user.routes.ts
router.get("/profesores", authenticateJWT, authorizeRoles("admin"), UserController.getProfesores);
router.get("/estudiantes", authenticateJWT, authorizeRoles("admin"), UserController.getEstudiantes);

// Solo accesible por admin
router.get("/", authenticateJWT, authorizeRoles("admin"), UserController.getAll);
router.get("/:id", authenticateJWT, authorizeRoles("admin"), UserController.getOne);
router.put("/:id", authenticateJWT, authorizeRoles("admin"), UserController.update);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), UserController.delete);

export default router;
