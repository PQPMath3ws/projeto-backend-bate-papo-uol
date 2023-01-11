import express from "express";

import { getDbInstance } from "../config/database.js";

const router = express.Router();

router.get("/messages", async (req, res) => {
    const messages = await getDbInstance().collection("messages").find().toArray();
    return res.status(200).send(messages);
});

export default router;