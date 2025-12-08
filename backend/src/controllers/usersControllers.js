import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(409).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword
        })

        const token = generateToken(newUser._id);

        res.cookie("token", token, {
            httpPnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        });
    } catch (error) {
        console.error("Error in signup controller", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        };

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        };

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            })

            res.cookie("jwt", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            })

            res.status(200).json({
                message: "User logged in successfully",
                token,
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email
                }
            })
        } else {
            return res.status(400).json({ message: "Invalid credentials" })
        }
    } catch (error) {
        console.error("Error in login controller", error)
        res.status(500).json({ message: "Internal server error" })
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 0
        })
        res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        console.error("Error in logout controller", error)
        res.status(500).json({ message: "Internal server error" })
    }
};

export const profile = (req, res) => {
    try {
        const user = {
            _id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            role: req.user.role
        }
        res.status(200).json(user)
    } catch (error) {
        console.error("Error in profile controller", error)
        res.status(500).json({ message: "Internal server error" })
    }
};




