import jwt from "jsonwebtoken";
import User from "../models/user.js";

export default async function checkAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.sendStatus(401);
    }

    const token = authHeader.slice(7);
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.sendStatus(401);
    }
    const user = await User.findByPk(payload.id);
    if (!user) {
        return res.sendStatus(401);
    }
    req.user = user;
    next();
}