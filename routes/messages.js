import express from "express";

import { getDbInstance } from "../config/database.js";

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

export default router;