import dayjs from "dayjs";

import { getDbInstance } from "../config/database.js";

let rduInterval = null;

async function removeDisconnectedUsers() {
    if (rduInterval) clearInterval(rduInterval);
    rduInterval = setInterval(async function() {
        let users = await getDbInstance().collection("participants").find().toArray();
        users = users.filter(user => Date.now() - user.lastStatus >= 15000);
        for (let i = 0; i < users.length; i++) {
            const messageStatus = {
                from: users[i].name,
                to: "Todos",
                text: "sai da sala...",
                type: 'status',
                time: dayjs().format("HH:mm:ss"),
            };
            await getDbInstance().collection("messages").insertOne(messageStatus);
            await getDbInstance().collection("participants").deleteOne({
                _id: users[i]._id,
            });
        }
    }, 15000);
}

export { removeDisconnectedUsers };