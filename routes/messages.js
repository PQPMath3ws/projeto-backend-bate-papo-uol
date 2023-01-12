import dayjs from "dayjs";
import express from "express";
import utf8 from "utf8";

import { getDbInstance } from "../config/database.js";
import { validateMessage } from "../schema/messages.js";

const router = express.Router();

router.get("/messages", async (req, res, next) => {
    const { user } = req.headers;
    if (!user || (user && typeof user !== "string")) return next();
    const { limit } = req.query;
    if (limit && Number.isNaN(parseInt(limit))) return next();
    let messages = await getDbInstance().collection("messages").find({
        $or: [
            {
                type: "private_message",
                from: user,
            },
            {
                type: "private_message",
                to: user,
            },
            {
                type: "private_message",
                to: "Todos",
            },
            {
                type: "message",
            },
            {
                type: "status",
            },
        ],
    }).sort({ time: -1 }).toArray();
    if (limit) messages.slice(0, parseInt(limit));
    return res.status(200).send(messages);
});

router.post("/messages", async (req, res, next) => {
    let { user } = req.headers;
    if (!user || (user && typeof user !== "string")) return next();
    user = utf8.decode(user);
    const participantExists = await getDbInstance().collection("participants").findOne({name: user});
    if (!participantExists) {
        req.noParticipant = true;
        return next();
    }
    const { to, text, type } = req.body;
    let message = {
        from: user,
        to,
        text,
        type,
        time: dayjs().format("HH:mm:ss"),
    };
    const messageValidation = await validateMessage(message);
    if (messageValidation.status !== "ok") {
        req.message = message;
        return next();
    }
    await getDbInstance().collection("messages").insertOne(message);
    return res.status(201).send({code: 201, message: "message sended successfully"});
});

export default router;