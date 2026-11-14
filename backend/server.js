import express from "express";
import apiRouter from "./routes/api.js";
import connection from "./models/db.js";
import User from "./models/user.js";
import Category from "./models/category.js";
import Equipment from "./models/equipment.js";

const app = express();

app.use(express.json());

app.get('/healthz', (req, res) => {
    res.json({
        uptime: process.uptime(),
        status: 'OK'
    });
});

app.use("/api", apiRouter);

await connection.sync({ alter: true });

app.listen(3000, () => console.log("Server listening on port 3000"));