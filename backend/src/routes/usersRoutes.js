import express from "express";
import { signup, login, logout } from "../controllers/usersControllers.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

//public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout)

//private routes
router.get("/profile", validateToken, (req, res) => {
    res.json({ message: "User profile" });
});

export default router;
