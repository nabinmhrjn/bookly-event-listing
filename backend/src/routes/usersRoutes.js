import express from "express";
import { signup, login, logout, getUserById, updateUser, forgotPassword, resetPassword } from "../controllers/usersControllers.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

//public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

//private routes
router.use(validateToken)
router.get("/:id", getUserById);
router.put("/:id", updateUser)

export default router;
