import { stripHtml } from "string-strip-html";
import dayjs from "dayjs";
import express from "express";
import mongo from "mongodb";
import utf8 from "utf8";

import { getDbInstance } from "../config/database.js";
import { validateMessage } from "../schema/messages.js";

const router = express.Router();

router.get("/messages", async (req, res, next) => {
    let { user } = req.headers;
    if (!user || (user && typeof user !== "string")) return next();
    user = stripHtml(user).result;
    user = user.trim();
    const { limit } = req.query;
    if (limit && Number.isNaN(parseInt(limit))) return next();
    if (limit <= 0) return next();
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
    }).toArray();
    if (limit) messages = messages.slice(0, parseInt(limit));
    return res.status(200).send(messages);
});

router.post("/messages", async (req, res, next) => {
    if (req.headers["content-type"] !== "application/json") return next();
    let { user } = req.headers;
    try {
        user = utf8.decode(user);
    } catch (_) {
        user = user;
    }
    if (!user || (user && typeof user !== "string")) return next();
    user = stripHtml(user).result;
    user = user.trim();
    const participantExists = await getDbInstance().collection("participants").findOne({name: user});
    if (!participantExists) {
        req.noParticipant = true;
        return next();
    }
    let { to, text, type } = req.body;
    to = stripHtml(to).result;
    to = to.trim();
    text = stripHtml(text).result;
    text = text.trim();
    type = stripHtml(type).result;
    type = type.trim();
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

router.delete("/messages/:id", async (req, res, next) => {
    let { user } = req.headers;
    try {
        user = utf8.decode(user);
    } catch (_) {
        user = user;
    }
    if (!user || (user && typeof user !== "string")) return next();
    user = stripHtml(user).result;
    user = user.trim();
    let { id } = req.params;
    id = stripHtml(id).result;
    id = id.trim();
    const messageExists = await getDbInstance().collection("messages").findOne({_id: mongo.ObjectId(id)});
    if (!messageExists) {
        req.noMessageExists = true;
        return next();
    }
    if (messageExists.from !== user) {
        req.notUserSenderMessage = true;
        return next();
    }
    await getDbInstance().collection("messages").deleteOne({_id: messageExists._id});
    return res.status(200).send({code: 200, message: "message deleted successfully"});
});

router.put("/messages/:id", async (req, res, next) => {
    let { user } = req.headers;
    try {
        user = utf8.decode(user);
    } catch (_) {
        user = user;
    }
    if (!user || (user && typeof user !== "string")) return next();
    user = stripHtml(user).result;
    user = user.trim();
    let { id } = req.params;
    id = stripHtml(id).result;
    id = id.trim();
    let messageExists = await getDbInstance().collection("messages").findOne({_id: mongo.ObjectId(id)});
    if (!messageExists) {
        req.noMessageExists = true;
        return next();
    }
    if (messageExists.from !== user) {
        req.notUserSenderMessage = true;
        return next();
    }
    let { to, text, type } = req.body;
    to = stripHtml(to).result;
    to = to.trim();
    text = stripHtml(text).result;
    text = text.trim();
    type = stripHtml(type).result;
    type = type.trim();
    messageExists = {
        from: messageExists.from,
        to,
        text,
        type,
        time: dayjs().format("HH:mm:ss"),
    }
    const messageValidation = await validateMessage(messageExists);
    if (messageValidation.status !== "ok") {
        req.message = messageExists;
        return next();
    }
    const updatedMesage = await getDbInstance().collection("messages").updateOne({
        _id: mongo.ObjectId(id),
    }, {
        $set: messageExists
    });
    if (updatedMesage.modifiedCount === 0) return next();
    return res.status(200).send({code: 200, message: "message updated successfully"});
});

export default router;