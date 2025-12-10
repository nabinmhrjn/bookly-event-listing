import express from "express";
import { signup, login, logout, getUserById, updateUser } from "../controllers/usersControllers.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

//public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout)

//private routes
router.use(validateToken)
router.get("/:id", getUserById);
router.put("/:id", updateUser)

export default router;
