import { stripHtml } from "string-strip-html";
import dayjs from "dayjs";
import express from "express";

import { getDbInstance } from "../config/database.js";
import { validateParticipant } from "../schema/participants.js";

const router = express.Router();

router.get("/participants", async (req, res) => {
    const participants = await getDbInstance().collection("participants").find({
    }, {
        projection:{
            _id:0
        }
    }).toArray();
    return res.status(200).send(participants);
});

router.post("/participants", async (req, res, next) => {
    if (req.headers["content-type"] !== "application/json") return next();
    let { name } = req.body;
    name = stripHtml(name).result;
    name = name.trim();
    const participant = {
        name,
        lastStatus: Date.now(),
    };
    const participantValidation = await validateParticipant(participant);
    if (participantValidation.status !== "ok") {
        req.participant = participant;
        return next();
    }
    const participantExists = await getDbInstance().collection("participants").findOne({name});
    if (participantExists) return next();
    await getDbInstance().collection("participants").insertOne(participant);
    const messageStatus = {
        from: name,
        to: "Todos",
        text: "entra na sala...",
        type: 'status',
        time: dayjs().format("HH:mm:ss"),
    };
    await getDbInstance().collection("messages").insertOne(messageStatus);
    return res.status(201).send({code: 201, message: "participant created successfully"});
});

export default router;