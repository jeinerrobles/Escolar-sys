import { Router } from "express";
import { MateriaController } from "../controllers/materia.controller";
import { NotaController } from '../controllers/nota.controller';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// Solo admin puede crear/editar/eliminar materias
router.get("/", authenticateJWT, MateriaController.getAll);
router.post("/", authenticateJWT, authorizeRoles("admin"), MateriaController.create);
router.get('/estructura', authenticateJWT, authorizeRoles('admin', 'profesor'), NotaController.getEstructura);
router.post('/guardar', authenticateJWT, authorizeRoles('admin', 'profesor'), NotaController.guardar);

router.put("/:id", authenticateJWT, authorizeRoles("admin"), MateriaController.update);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), MateriaController.delete);

export default router;
