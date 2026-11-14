import { Router } from "express";
import Category from "../models/category.js";
import checkAuth from "../middlewares/checkAuth.js";
import checkRole from "../middlewares/checkRole.js";

const router = new Router();

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

    const categories = await Category.findAll({
        where: filters,
        ...otherParams
    });

    res.json(categories);
});

router.post('', checkAuth, checkRole("admin"), async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            res.status(422).json({
            });
        } else {
            console.error(error);
            res.sendStatus(500);
        }
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const category = await Category.findByPk(id);

    if (!category) return res.sendStatus(404);
    res.json(category);
});

router.patch('/:id', checkAuth, checkRole("admin"), async (req, res) => {
    const id = req.params.id;

    try {
        const [, [category]] = await Category.update(req.body, {
            where: { id },
            returning: true
        });

        if (!category) return res.sendStatus(404);
        res.json(category);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            res.status(422).json({
            });
        } else {
            console.error(error);
            res.sendStatus(500);
        }
    }
});

router.delete('/:id', checkAuth, checkRole("admin"), async (req, res) => {
    const id = req.params.id;

    const nbDeleted = await Category.destroy({
        where: { id }
    });

    if (!nbDeleted) return res.sendStatus(404);
    res.sendStatus(204);
});

export default router;
