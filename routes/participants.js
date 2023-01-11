import express from "express";

import { getDbInstance } from "../config/database.js";
import { validateParticipant } from "../schema/participants.js";

const router = express.Router();

router.get("/participants", async (req, res) => {
    const participants = await getDbInstance().collection("participants").find().toArray();
    return res.status(200).send(participants);
});

router.post("/participants", async (req, res, next) => {
    const { name } = req.body;
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
    return res.status(201).send({code: 201, message: "participant created successfully"});
});

export default router;