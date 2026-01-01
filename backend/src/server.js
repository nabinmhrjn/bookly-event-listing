import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import eventsRoutes from "./routes/eventsRoutes.js"
import usersRoutes from "./routes/usersRoutes.js"
import bookingsRoutes from "./routes/bookingsRoutes.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: "http://localhost:3000", credentials: true })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/events", eventsRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/bookings", bookingsRoutes)


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port:${PORT}`);
    });
});


