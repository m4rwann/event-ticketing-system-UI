const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

const authRouter = require("./routes/auth");
const forgotPasswordRoutes = require("./routes/forgotPassword");
const userRouter = require("./routes/user");
const eventRouter = require("./routes/event");
const bookingRouter = require("./routes/booking");
const uploadRouter = require("./routes/uploadRoutes");
const authenticationMiddleware = require('./middleware/authenticationMiddleware')

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.ORIGIN,
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true
    })
);

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Public routes (no authentication required)
app.use("/api/v1", authRouter);
app.use("/api/v1", forgotPasswordRoutes);

// Protected routes (authentication required)
app.use("/api/v1/users", authenticationMiddleware, userRouter);
app.use("/api/v1/events", authenticationMiddleware, eventRouter);
app.use("/api/v1/bookings", authenticationMiddleware, bookingRouter);
app.use("/api/v1/upload", authenticationMiddleware, uploadRouter);

const db_name = process.env.DB_NAME;
const db_url = `${process.env.DB_URL}/${db_name}`;

mongoose
    .connect(db_url)
    .then(() => console.log("mongoDB connected"))
    .catch((e) => {
        console.log(e);
    });

app.use(function (req, res, next) {
    return res.status(404).send("404");
});
app.listen(process.env.PORT, () => console.log("server started"));

module.exports = app;