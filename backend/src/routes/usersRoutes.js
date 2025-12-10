import express from "express";
import { signup, login, logout, getUserById } from "../controllers/usersControllers.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

//public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout)

//private routes
router.use(validateToken)
router.get("/:id", getUserById);

export default router;
