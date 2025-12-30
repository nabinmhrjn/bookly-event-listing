import express from "express";
import { createEvent, deleteEvent, getAllEvents, getEventById, getEventByUserId, updateEvent } from "../controllers/eventsControllers.js";
import { validateToken } from "../middleware/validateToken.js";
import { eventImageUpload } from "../middleware/eventImageUpload.js";

const router = express.Router();

//puiblic routes
router.get("/", getAllEvents);
router.get("/:id", getEventById)

//protected routes
router.use(validateToken)
router.post("/", eventImageUpload, createEvent);
router.get("/user/:id", getEventByUserId)
router.put("/:id", eventImageUpload, updateEvent)
router.delete("/:id", deleteEvent)

export default router;