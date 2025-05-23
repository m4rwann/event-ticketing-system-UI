const express = require("express");
const router = express.Router();
const {
    sendOtp,
    verifyOtpAndReset
} = require("../controllers/forgotPasswordController");

router.post("/forgetPassword", sendOtp);
router.put("/forgetPassword", verifyOtpAndReset);

module.exports = router;