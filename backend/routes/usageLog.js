import { Router } from "express";
import UsageLog from "../models/usageLog.js";
import Equipment from "../models/equipment.js";
import User from "../models/user.js";

const router = new Router();

const includes = [
    Equipment,
    { model: User, attributes: ["id", "email", "firstname", "lastname"] }
];

router.get('', async (req, res) => {
    const { page, itemsPerPage=10, sort, ...filters } = req.query;
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

    const usageLogs = await UsageLog.findAll({
        where: filters,
        include: includes,
        ...otherParams
    });

    res.json(usageLogs);
});

router.post('', async (req, res) => {
    const { type, notes, date, equipmentId } = req.body;

    try {
        const usageLog = await UsageLog.create({
            type,
            notes,
            date,
            equipmentId,
            userId: req.user.id
        });
        res.status(201).json(usageLog);
    } catch (error) {
        if (validationErrorNames.includes(error.name)) {
            res.status(422).json(formatErrors(error));

        } else {
            console.error(error);
            res.sendStatus(500);
        }
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const usageLog = await UsageLog.findByPk(id, { include: includes });

    if (!usageLog) return res.sendStatus(404);
    res.json(usageLog);
});

router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const { type, notes, date, equipmentId } = req.body;

    try {
        const [, [usageLog]] = await UsageLog.update({ type, notes, date, equipmentId }, {
            where: { id },
            returning: true
        });

        if (!usageLog) return res.sendStatus(404);
        res.json(usageLog);
    } catch (error) {
        if (validationErrorNames.includes(error.name)) {
            res.status(422).json(formatErrors(error));

        } else {
            console.error(error);
            res.sendStatus(500);
        }
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    const nbDeleted = await UsageLog.destroy({
        where: { id }
    });

    if (!nbDeleted) return res.sendStatus(404);
    res.sendStatus(204);
});

export default router;
