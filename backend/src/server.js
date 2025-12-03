import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import eventsRoutes from "./routes/eventsRoutes.js"
import usersRoutes from "./routes/usersRoutes.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: "http://localhost:3000" })
);

app.use(express.json());
app.use("/api/events", eventsRoutes)
app.use("/api/users", usersRoutes)


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port:${PORT}`);
    });
});


