import { Router } from "express";
import userRouter from "./user.js";
import securityRouter from "./security.js";
import categoryRouter from "./category.js";
import equipmentRouter from "./equipment.js";
import checkAuth from "../middlewares/checkAuth.js";
import checkRole from "../middlewares/checkRole.js";

const router = new Router();

router.use('/users', checkAuth, checkRole("admin"), userRouter);
router.use(securityRouter);
router.use('/categories', categoryRouter);
router.use('/equipments', equipmentRouter);

export default router;