import express from "express";

import errors from "../const/errors.js";

const router = express.Router();

router.all("/participants", (req, res) => {
    if (req.method !== "POST") return res.status(errors[405].code).send(errors[405]);
});

router.all("/messages", (req, res) => {
    if (req.method !== "POST") return res.status(errors[405].code).send(errors[405]);
});

router.all("*", (req, res) => {
    return res.status(errors[404].code).send(errors[404]);
});

export default router;