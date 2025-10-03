import { Router } from "express";
import { CursoController } from "../controllers/curso.controller";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticateJWT, authorizeRoles("admin"), CursoController.getAll);
router.get("/:id", authenticateJWT, authorizeRoles("admin"), CursoController.getOne);
router.post("/", authenticateJWT, authorizeRoles("admin"), CursoController.create);
router.put("/:id", authenticateJWT, authorizeRoles("admin"), CursoController.update);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), CursoController.delete);
router.post("/:id/profesor/:profesorId", authenticateJWT, authorizeRoles("admin"), CursoController.assignProfesor);
router.post("/:id/estudiantes", authenticateJWT, authorizeRoles("admin"), CursoController.assignEstudiantes);

export default router;
