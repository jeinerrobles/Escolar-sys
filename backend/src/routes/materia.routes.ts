import { Router } from "express";
import { MateriaController } from "../controllers/materia.controller";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// Solo admin puede crear/editar/eliminar materias
router.get("/", authenticateJWT, MateriaController.getAll);
router.get("/:id", authenticateJWT, MateriaController.getOne);
router.post("/", authenticateJWT, authorizeRoles("admin"), MateriaController.create);
router.put("/:id", authenticateJWT, authorizeRoles("admin"), MateriaController.update);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), MateriaController.delete);

// Asignaciones
router.post("/asignar-profesor", authenticateJWT, authorizeRoles("admin"), MateriaController.asignarProfesor);
router.post("/inscribir-estudiante", authenticateJWT, authorizeRoles("admin", "profesor"), MateriaController.inscribirEstudiante);

export default router;
