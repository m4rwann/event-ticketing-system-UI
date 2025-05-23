const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}`,
        });

        res.json({ message: "OTP sent" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.verifyOtpAndReset = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: "Password updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
