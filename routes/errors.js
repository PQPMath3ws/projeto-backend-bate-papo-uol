import express from "express";

import errors from "../const/errors.js";
import { validateParticipant } from "../schema/participants.js";

const router = express.Router();

router.all("/participants", async (req, res) => {
    if (req.method !== "POST") return res.status(errors[405].code).send(errors[405]);
    const participantValidation = await validateParticipant(req.participant);
    if (participantValidation.status !== "ok") {
        errors["422.1"].message = participantValidation.message;
        return res.status(errors["422.1"].code).send(errors["422.1"]);
    }
    return res.status(errors["409.1"].code).send(errors["409.1"]);
});

router.all("/messages", (req, res) => {
    if (req.method === "GET") {
        const { user } = req.headers;
        if (!user || (user && typeof user !== "string")) return res.status(errors["400.1"].code).send(errors["400.1"]);
        const { limit } = req.query;
        if (limit && Number.isNaN(parseInt(limit))) return res.status(errors["400.2"].code).send(errors["400.2"]);
    }
    if (req.method !== "POST") return res.status(errors[405].code).send(errors[405]);
});

router.all("*", (req, res) => {
    return res.status(errors[404].code).send(errors[404]);
});

export default router;