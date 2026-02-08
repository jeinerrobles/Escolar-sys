import { Router } from "express";
import { NotaController } from '../controllers/nota.controller';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

router.get('/:estudianteId/:cursoId', authenticateJWT, authorizeRoles('admin', 'profesor', 'estudiante'), NotaController.getBoletin);

export default router;
