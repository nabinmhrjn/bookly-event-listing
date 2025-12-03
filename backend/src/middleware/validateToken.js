import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const validateToken = async (req, res, next) => {
    let token;

    token = req.cookies.jwt

    if (token) {
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(verified.userId).select("-password");
            next();
        } catch (error) {
            res.status(401).json({ message: "Unauthorized" })
        }
    } else {
        res.status(401).json({ message: "Unauthorized" })
    }
}