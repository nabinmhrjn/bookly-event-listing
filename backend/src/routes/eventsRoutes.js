import express from "express";
import { createEvent } from "../controllers/eventsControllers.js";

const router = express.Router();

router.post("/", createEvent);

export default router;