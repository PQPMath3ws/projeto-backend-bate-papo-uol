import express from "express";

import { getDbInstance } from "../config/database.js";

const router = express.Router();

router.get("/participants", async (req, res) => {
    const participants = await getDbInstance().collection("participants").find().toArray();
    return res.status(200).send(participants);
});

export default router;