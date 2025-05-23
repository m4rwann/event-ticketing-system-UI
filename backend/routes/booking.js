const express = require("express");
const bookingController = require("../controllers/bookingController");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const router = express.Router();

router.post("/", authorizationMiddleware("user"), bookingController.BookATicket);
router.get("/:id", authorizationMiddleware("user"), bookingController.getBooking);
router.delete("/:id", authorizationMiddleware("user"), bookingController.cancelBooking);

module.exports = router;