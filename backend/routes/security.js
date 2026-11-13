import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = new Router();

router.post("/register", async (req, res) => {
    const { email, password, firstname, lastname } = req.body;
    try {
        const user = await User.create({ email, password, firstname, lastname });
        res.status(201).json(user);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            res.status(422).json({
                message: error.message
            });
        } else {
            console.error(error);
            res.sendStatus(500);
        }
            }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({error: "Email et mot de passe requis"});
    }
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({error: "Indentifiants invalides"});
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

router.get("/me", checkAuth, async (req, res) => {
    res.json(req.user);
});

export default router;