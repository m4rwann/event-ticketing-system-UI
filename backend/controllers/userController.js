const userModel = require("../models/userModel");
const eventModel = require("../models/eventModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const userController = {
    register: async (req, res) => {
        try {
            const { email, password, name, role } = req.body;

            // Check if the user already exists
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: "User already exists" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new userModel({
                email,
                password: hashedPassword,
                name,
                role,
            });

            // Save the user to the database
            await newUser.save();

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find the user by email
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "email not found" });
            }

            console.log("password: ", user.password);
            // Check if the password is correct

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(405).json({ message: "incorect password" });
            }

            const currentDateTime = new Date();
            const expiresAt = new Date(+currentDateTime + 1800000); // expire in 3 minutes
            // Generate a JWT token
            const token = jwt.sign(
                { user: { userId: user._id, role: user.role } },
                secretKey,
                {
                    expiresIn: 3 * 60 * 60,
                }
            );

            return res
                .cookie("token", token, {
                    expires: expiresAt,
                    httpOnly: true,
                    secure: true, // if not working on thunder client , remove it
                    SameSite: "none",
                })
                .status(200)
                .json({ message: "login successfully", user });
        } catch (error) {
            console.error("Error logging in:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await userModel.find();
            return res.status(200).json(users);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    },
    getUserProfile: async (req, res) => {
        try {
            const user = await userModel.findById(req.user.userId).select("-password");
            if (!user) return res.status(404).json({ message: "User not found" });
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    updateUserProfile: async (req, res) => {
        try {
            const user = await userModel.findById(req.user.userId);
            if (!user) return res.status(404).json({ message: "User not found" });
            user.name = req.body.name || user.name;
            if (req.body.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
            }
            const updatedUser = await user.save();
            return res.status(200).json({ message: "Profile updated", user: updatedUser });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    },
    getUserDetails: async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id).select("-password");
            if (!user) return res.status(404).json({ message: "User not found" });
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    updateUserRole: async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id).select("-password");
            if (!user) return res.status(404).json({ message: "User not found" });
            const newRole = req.body.role;
            if (!["user", "organizer", "admin"].includes(newRole)) {
                return res.status(400).json({ message: "Invalid role value" });
            }

            user.role = newRole;
            const updatedUser = await user.save();
            return res.status(200).json({ message: "Role updated", updatedUser: user.role });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id);
            if (!user) return res.status(404).json({ message: "User not found" });

            await user.deleteOne();
            return res.status(200).json({ message: "User deleted successfully" });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    },
    getCurrentUserEvents: async (req, res) => {
        try {
            const organizerId = req.user.userId;
            const events = await eventModel.find({ organizer: organizerId });
            if (!events) return res.status(404).json({ message: "No Events created yet" });
            return res.status(200).json(events);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    },
    getEventAnalytics: async (req, res) => {
        try {
            const organizerId = req.user.userId;
            const events = await eventModel.find({ organizer: organizerId });
            if (!events || events.length === 0) return res.status(404).json({ message: "No events created yet" });
            const analytics = events.map(event => {
                const booked = event.totalTickets - event.remainingTickets;
                const percentage = ((booked / event.totalTickets) * 100).toFixed(2);
                return {
                    eventId: event._id,
                    title: event.title,
                    date: event.date,
                    category: event.category,
                    percentage
                };
            });

            return res.status(200).json(analytics);
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie("token");
            return res.status(200).json({ message: "Logout successful" });
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
};

module.exports = userController;