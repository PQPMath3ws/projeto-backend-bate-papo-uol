import express from "express";

import { getDbInstance } from "../config/database.js";

const router = express.Router();

router.get("/messages", async (req, res, next) => {
    const { user } = req.headers;
    if (!user || (user && typeof user !== "string")) return next();
    const { limit } = req.query;
    if (limit && Number.isNaN(parseInt(limit))) return next();
    let messages = await getDbInstance().collection("messages").find().sort({ time: -1 }).toArray();
    if (limit) messages.slice(0, parseInt(limit));
    messages = messages.filter(message => {
        if (message.type === "private_message") return (message.to === user || message.from === user);
        return true;
    });
    return res.status(200).send(messages);
});

export default router;