import { Router } from "express";
import { Op } from "sequelize";
import Reservation from "../models/reservation.js";
import Equipment from "../models/equipment.js";
import User from "../models/user.js";
import checkRole from "../middlewares/checkRole.js";

const router = new Router();

const includes = [ Equipment, { model: User, attributes: ["id", "email", "firstname", "lastname"] } ];

const transitions = {
    "pending": ["approved", "rejected", "cancelled"],
    "approved": ["returned", "cancelled"],
};


router.get('', async (req, res) => {
    const { page, itemsPerPage, sort, ...filters } = req.query;
    const otherParams = {};

    if (page) {
        otherParams.offset = (page - 1) * itemsPerPage;
        otherParams.limit = itemsPerPage;
    }
    if (sort) {
        const direction = sort.startsWith("-") ? "DESC" : "ASC";
        const key = sort.startsWith("-") ? sort.slice(1) : sort;
        otherParams.order = [[key, direction]];
    }

    if (req.user.role !== "admin") {
        filters.userId = req.user.id;
    }

    const reservations = await Reservation.findAll({
        where: filters,
        include: includes,
        ...otherParams
    });

    res.json(reservations);
});

router.post('', async (req, res) => {
    const { equipmentId, startDate, endDate, comment } = req.body;
    try {
        const reservation = Reservation.build({
            equipmentId,
            startDate,
            endDate,
            comment,
            userId: req.user.id
        });
        await reservation.validate();

        const equipment = await Equipment.findByPk(equipmentId);
        if (!equipment) return res.status(422).json({ equipmentId: ["Equipment not found"] });
        if (equipment.status !== "available") return res.status(422).json({ equipmentId: ["Equipment not available"] });
        const overlap = await Reservation.findOne({
            where: {
            equipmentId,
            status: ["pending", "approved"],
            startDate: { [Op.lte]: endDate },
            endDate: { [Op.gte]: startDate }
            }
        });
        if (overlap) return res.status(409).json({ message: "Equipment already reserved for the selected dates" });

        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            res.status(422).json({
            // invalidKey : [ "message 1", "message 2"]
        });
        }else {
            console.error(error);
            res.sendStatus(500);
     }
}
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const reservation = await Reservation.findByPk(id, { include: includes });

    if (!reservation) return res.sendStatus(404);
    if (req.user.role !== "admin" && reservation.userId !== req.user.id) return res.sendStatus(404);
        res.json(reservation);
    });

router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const { status } =req.body;

    const reservation = await Reservation.findByPk(id);
    if (!reservation) return res.sendStatus(404);

    const isAdmin = req.user.role === "admin";
    if (!isAdmin && reservation.userId !== req.user.id) return res.sendStatus(404);

    if (!isAdmin && status !== "cancelled") return res.sendStatus(403);

    const allowed = transitions[reservation.status] || [];
    if (!allowed.includes(status)) {
        return res.status(422).json({ status: [`Invalid transition from ${reservation.status} to ${status}`] });
    }

    reservation.status = status;
    await reservation.save();
    res.json(reservation);
});

router.delete('/:id', checkRole("admin"), async (req, res) => {
    const id = req.params.id;

    const nbDeleted = await Reservation.destroy({
        where: { id }
    });

    if (!nbDeleted) return res.sendStatus(404);
    res.sendStatus(204);
});

export default router;