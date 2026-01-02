import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const validateToken = async (req, res, next) => {
    let token;

    token = req.cookies.jwt

    if (token) {
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(verified._id).select("-password");

            if (!req.user) {
                console.error("User not found in database for token:", verified._id);
                return res.status(401).json({ message: "User not found" });
            }

            next();
        } catch (error) {
            console.error("Token verification error:", error.message);
            res.status(401).json({ message: "Unauthorized - Invalid token" })
        }
    } else {
        console.error("No token found in cookies");
        res.status(401).json({ message: "Unauthorized - No token provided" })
    }
}