import { Router } from "express";
import userRouter from "./user.js";
import securityRouter from "./security.js";
import checkAuth from "../middlewares/checkAuth.js";
import checkRole from "../middlewares/checkRole.js";

const router = new Router();

router.use('/users', checkAuth, checkRole("admin"), userRouter);
router.use(securityRouter);

export default router;