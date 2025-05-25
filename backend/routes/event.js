const express = require("express");
const eventController = require("../controllers/eventController");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const router = express.Router();

router.post("/", authenticationMiddleware, authorizationMiddleware('organizer'), eventController.createEvent);
router.get("/", eventController.getAllEvents);
router.get("/all", authenticationMiddleware, authorizationMiddleware('admin'), eventController.getAllEvents);
router.get("/:id", eventController.getEventDetails);
router.put("/:id", authenticationMiddleware, authorizationMiddleware(['organizer', 'admin']), eventController.updateEvent);
router.delete("/:id", authenticationMiddleware, authorizationMiddleware(['organizer', 'admin']), eventController.deleteEvent);

module.exports = router;