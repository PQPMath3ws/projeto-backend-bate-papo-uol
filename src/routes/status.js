import { stripHtml } from "string-strip-html";
import express from "express";
import utf8 from "utf8";

import { getDbInstance } from "../config/database.js";

const router = express.Router();

router.post("/status", async (req, res, next) => {
    let { user } = req.headers;
    try {
        user = utf8.decode(user);
    } catch (_) {
        user = user;
    }
    if (!user || (user && typeof user !== "string")) return next();
    user = stripHtml(user).result;
    user = user.trim();
    const userExists = await getDbInstance().collection("participants").findOne({name: user});
    if (!userExists) {
        req.noUser = true;
        return next();
    }
    await getDbInstance().collection("participants").updateOne({
        _id: userExists._id,
    }, {
        $set: {
            lastStatus: Date.now(),
        },
    });
    return res.status(200).send({code: 200, message: "user status updated successfully"});
});

export default router;