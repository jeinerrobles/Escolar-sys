import { Router } from "express";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";
import {PeriodoController} from "../controllers/periodo.controller";

const router = Router();

router.get('/', authenticateJWT, authorizeRoles('admin', 'profesor', 'estudiante'), PeriodoController.getPeriodos);
router.put('/', authenticateJWT, authorizeRoles('admin'), PeriodoController.actualizarPeriodos);
export default router;
