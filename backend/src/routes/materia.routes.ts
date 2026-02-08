import { Router } from "express";
import { MateriaController } from "../controllers/materia.controller";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// Solo admin puede crear/editar/eliminar materias
router.get("/", authenticateJWT, authorizeRoles("admin", "profesor"), MateriaController.getAll);
router.get("/:id", authenticateJWT, authorizeRoles("admin"), MateriaController.getById);
router.get("/grado/:id", authenticateJWT, authorizeRoles("admin"), MateriaController.getByGrado);
router.post("/", authenticateJWT, authorizeRoles("admin"), MateriaController.create);
router.put("/:id", authenticateJWT, authorizeRoles("admin"), MateriaController.update);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), MateriaController.delete);


export default router;
