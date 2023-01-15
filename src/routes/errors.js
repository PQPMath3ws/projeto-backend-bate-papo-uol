import { stripHtml } from "string-strip-html";
import express from "express";
import utf8 from "utf8";

import errors from "../const/errors.js";
import { validateMessage } from "../schema/messages.js";
import { validateParticipant } from "../schema/participants.js";

const router = express.Router();

router.all("/participants", async (req, res) => {
    if (req.method !== "POST") return res.status(errors[405].code).send(errors[405]);
    if (req.headers["content-type"] !== "application/json") return res.status(errors[415].code).send(errors[415]);
    const participantValidation = await validateParticipant(req.participant);
    if (participantValidation.status !== "ok") {
        errors["422.1"].message = participantValidation.message;
        return res.status(errors["422.1"].code).send(errors["422.1"]);
    }
    return res.status(errors["409.1"].code).send(errors["409.1"]);
});

router.all("/messages", async (req, res) => {
    let { user } = req.headers;
    try {
        user = utf8.decode(user);
    } catch (_) {
        user = user;
    }
    if (!user || (user && typeof user !== "string")) return res.status(errors["400.3"].code).send(errors["400.3"]);
    user = stripHtml(user).result;
    user = user.trim();
    if (req.method === "GET") {
        const { limit } = req.query;
        if (limit && Number.isNaN(parseInt(limit))) return res.status(errors["400.2"].code).send(errors["400.2"]);
        if (limit <= 0) return res.status(errors["400.2"].code).send(errors["400.2"]);
    }
    if (req.method !== "POST") return res.status(errors[405].code).send(errors[405]);
    if (req.headers["content-type"] !== "application/json") return res.status(errors[415].code).send(errors[415]);
    if (req.noParticipant) {
        errors["422.1"].message = "participant/sender not logged in";
        return res.status(errors["422.1"].code).send(errors["422.1"]);
    }
    const messageValidation = await validateMessage(req.message);
    errors["422.1"].message = messageValidation.message;
    return res.status(errors["422.1"].code).send(errors["422.1"]);
});

router.all("/messages/:id", async (req, res) => {
    if (req.method !== "PUT" && req.method !== "DELETE") return res.status(errors[405].code).send(errors[405]);
    let { user } = req.headers;
    try {
        user = utf8.decode(user);
    } catch (_) {
        user = user;
    }
    if (!user || (user && typeof user !== "string")) return res.status(errors["400.3"].code).send(errors["400.3"]);
    if (req.method === "DELETE") {
        if (req.noMessageExists) return res.status(errors["404.3"].code).send(errors["404.3"]);
        if (req.notUserSenderMessage) return res.status(errors["401.1"].code).send(errors["401.1"]);
    } else {
    }
});

router.all("/status", async (req, res) => {
    let { user } = req.headers;
    try {
        user = utf8.decode(user);
    } catch (_) {
        user = user;
    }
    if (!user || (user && typeof user !== "string")) return res.status(errors["400.3"].code).send(errors["400.3"]);
    user = stripHtml(user).result;
    user = user.trim();
    if (req.method !== "POST") return res.status(errors[405].code).send(errors[405]);
    return res.status(errors["404.2"].code).send(errors["404.2"]);
});

router.all("*", (req, res) => {
    return res.status(errors["404.1"].code).send(errors["404.1"]);
});

export default router;