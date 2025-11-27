import express from "express";
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from "../controllers/eventsControllers.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById)
router.put("/:id", updateEvent)
router.delete("/:id", deleteEvent)

export default router;