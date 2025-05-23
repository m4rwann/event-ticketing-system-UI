const express = require("express");
const eventController = require("../controllers/eventController");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const router = express.Router();

router.post("/", authorizationMiddleware('organizer'), eventController.createEvent);
router.get("/", eventController.getAllEvents);
router.get("/all", authorizationMiddleware('admin'), eventController.getAllEvents);
router.get("/:id", eventController.getEventDetails);
router.put("/:id", authorizationMiddleware(['organizer', 'admin']), eventController.updateEvent);
router.delete("/:id", authorizationMiddleware(['organizer', 'admin']), eventController.deleteEvent);

module.exports = router;