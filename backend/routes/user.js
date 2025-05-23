const express = require("express");
const userController = require("../controllers/userController");
const bookingsController = require("../controllers/bookingController");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const router = express.Router();

router.get("/", authorizationMiddleware('admin'), userController.getAllUsers);
router.get("/profile", userController.getUserProfile);
router.put("/profile", userController.updateUserProfile);
router.get("/bookings", authorizationMiddleware('user'), bookingsController.getUserBookings);
router.get("/events", authorizationMiddleware('organizer'), userController.getCurrentUserEvents);
router.get("/events/analytics", authorizationMiddleware('organizer'), userController.getEventAnalytics);
router.get("/:id", authorizationMiddleware('admin'), userController.getUserDetails);
router.put("/:id", authorizationMiddleware('admin'), userController.updateUserRole);
router.delete("/:id", authorizationMiddleware('admin'), userController.deleteUser);

module.exports = router;