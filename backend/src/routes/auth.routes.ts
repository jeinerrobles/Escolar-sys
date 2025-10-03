import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get("/profile", authenticateJWT,(req, res) => {
    res.json({ message: "Perfil de usuario", user: req.user });
  }
);

router.get("/admin",authenticateJWT,authorizeRoles("admin"),(req, res) => {
    res.json({ message: "Bienvenido admin", user: req.user });
  }
);

export default router;
