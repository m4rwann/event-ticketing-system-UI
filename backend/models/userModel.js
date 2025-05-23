const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            minLength: 3,
            maxLength: 30,
            required: true,

        },
        role: {
            type: String,
            enum: ["user", "organizer", "admin"],
            default: "user",
        },
        otp: String,
        otpExpires: Date
    },
    // schemaOptions
    {
        strict: false,
        timestamps: true,
    }
);


module.exports = mongoose.models.User || mongoose.model("User", userSchema);
