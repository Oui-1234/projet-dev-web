import express from "express";
import apiRouter from "./routes/api.js";
import connection from "./models/db.js";
import User from "./models/user.js";
import Category from "./models/category.js";
import Equipment from "./models/equipment.js";
import UsageLog from "./models/usageLog.js";
import Reservation from "./models/reservation.js";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());

app.get('/healthz', (req, res) => {
    res.json({
        uptime: process.uptime(),
        status: 'OK'
    });
});

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.sendStatus(err.status || 500);
});

await connection.sync({ alter: true });

app.listen(3000, () => console.log("Server listening on port 3000"));