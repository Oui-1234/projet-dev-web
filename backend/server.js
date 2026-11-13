import express from "express";
import apiRouter from "./routes/api.js";
import connection from "./models/db.js";

const app = express();

app.use(express.json());

app.get('/healthz', (req, res) => {
    res.json({
        uptime: process.uptime(),
        status: 'OK'
    });
});

app.use("/api", apiRouter);

app.listen(3000, () => console.log("Server listening on port 3000"));