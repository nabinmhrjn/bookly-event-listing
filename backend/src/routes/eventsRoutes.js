import express from "express";
import { createEvent, deleteEvent, getAllEvents, getEventById, getEventByUserId, updateEvent } from "../controllers/eventsControllers.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

//puiblic routes
router.get("/", getAllEvents);
router.get("/:id", getEventById)

//protected routes
router.use(validateToken)
router.post("/", createEvent);
router.get("/user/:id", getEventByUserId)
router.put("/:id", updateEvent)
router.delete("/:id", deleteEvent)

export default router;