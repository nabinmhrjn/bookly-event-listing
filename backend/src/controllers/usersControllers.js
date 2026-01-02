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

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                _id: newUser._id,
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

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found!" });
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in user controller of getting user by id", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { fullName, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            { fullName, email },
            { new: true }
        );
        if (!updatedUser)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json({
            message: "User profile updated successfully 🎊",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in updateUser controller", error);
        res.status(500).json({ message: "Internal server error 💥" });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // don't reveal if user exists or not for security
            return res.status(200).json({
                message: "If an account exists with this email, you will receive a password reset link"
            });
        }

        // generate reset token using crypto
        const crypto = await import('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');

        // hash the token before saving to database
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // save hashed token and expiry to user
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // create reset URL (frontend URL)
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // TODO: Send email with reset link
        // For now, we'll just return the link (in production, send via email)
        console.log("Password Reset Link:", resetUrl);

        res.status(200).json({
            message: "Password reset link has been sent to your email",
            // Remove this in production - only for development
            resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
        });

    } catch (error) {
        console.error("Error in forgotPassword controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Hash the token from URL to compare with stored hash
        const crypto = await import('crypto');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token and not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({
            message: "Password has been reset successfully. You can now login with your new password."
        });

    } catch (error) {
        console.error("Error in resetPassword controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};