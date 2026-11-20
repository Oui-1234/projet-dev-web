import { Router } from "express";
import Equipment from "../models/equipment.js";
import Category from "../models/category.js";
import checkAuth from "../middlewares/checkAuth.js";
import checkRole from "../middlewares/checkRole.js";

const router = new Router();

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

    const equipments = await Equipment.findAll({
        where: filters,
        include: Category,
        ...otherParams
    });

    res.json(equipments);
});

router.post('', checkAuth, checkRole("admin"), async (req, res) => {
    try {
        const equipment = await Equipment.create(req.body);
        res.status(201).json(equipment);
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
    const equipment = await Equipment.findByPk(id, { include: Category });

    if (!equipment) return res.sendStatus(404);
    res.json(equipment);
});

router.patch('/:id', checkAuth, checkRole("admin"), async (req, res) => {
    const id = req.params.id;

    try {
        const [, [equipment]] = await Equipment.update(req.body, {
            where: { id },
            returning: true
        });

        if (!equipment) return res.sendStatus(404);
        res.json(equipment);
    } catch (error) {
        if (validationErrorNames.includes(error.name)) {
            res.status(422).json(formatErrors(error));

        } else {
            console.error(error);
            res.sendStatus(500);
        }
    }
});

router.delete('/:id', checkAuth, checkRole("admin"), async (req, res) => {
    const id = req.params.id;

    const nbDeleted = await Equipment.destroy({
        where: { id }
    });

    if (!nbDeleted) return res.sendStatus(404);
    res.sendStatus(204);
});

export default router;
