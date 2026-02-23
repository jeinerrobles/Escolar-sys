import { Router } from "express";
import { CursoController } from "../controllers/curso.controller";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

//  Todos los roles autenticados pueden consultar cursos
router.get(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "profesor", "estudiante"),
  CursoController.getAll
);

//  Solo admin puede ver uno específico
router.get(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  CursoController.getOne
);

//  Solo admin puede crear
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("admin"),
  CursoController.create
);

//  Solo admin puede editar
router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  CursoController.update
);

//  Solo admin puede eliminar
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  CursoController.delete
);

router.post(
  "/:id/profesor/:profesorId",
  authenticateJWT,
  authorizeRoles("admin"),
  CursoController.assignProfesor
);

router.post(
  "/:id/estudiantes",
  authenticateJWT,
  authorizeRoles("admin"),
  CursoController.assignEstudiantes
);

router.post(
  "/:id/grado/:gradoId",
  authenticateJWT,
  authorizeRoles("admin"),
  CursoController.assignGrado
);

export default router;
