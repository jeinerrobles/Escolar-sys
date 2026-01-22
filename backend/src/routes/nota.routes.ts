import { Router } from "express";
import { MateriaController } from "../controllers/materia.controller";
import { NotaController } from '../controllers/nota.controller';
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";
import { PeriodoController } from "../controllers/periodo.controller";

const router = Router();

// Solo admin puede crear/editar/eliminar materias
router.get("/", authenticateJWT, MateriaController.getAll);
router.post("/", authenticateJWT, authorizeRoles("admin"), MateriaController.create);

router.get('/periodos', authenticateJWT, PeriodoController.getPeriodos);
router.put('/periodos', authenticateJWT, authorizeRoles('admin'), PeriodoController.actualizarPeriodos);



router.get('/estructura', NotaController.getEstructura);
router.post('/guardar', NotaController.guardar);

// LAS RUTAS CON PARAMETROS DEBEN IR AL FINAL

router.put("/:id", authenticateJWT, authorizeRoles("admin"), MateriaController.update);
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), MateriaController.delete);

router.get('/:estudianteId/:cursoId',authenticateJWT, NotaController.getBoletin);





export default router;
