import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";

import { closeDbConnection } from "./database.js";

import ErrorsRoutes from "../routes/errors.js";
import MessagesRoutes from "../routes/messages.js";
import ParticipantsRoutes from "../routes/participants.js";
import StatusRoutes from "../routes/status.js";

dotenv.config();

const app = express();
let server = null;

async function onShutDownServer() {
    if (server) {
        closeDbConnection((error) => {
            if (error) throw Error("Falha ao desconectar do banco de dados!");
            server.close(() => {
                process.exit(0);
            });
        });
    }
}

function initializeServer() {
    if (!server) {
        app.use(cors());
        app.use(express.json());

        app.use(MessagesRoutes);
        app.use(ParticipantsRoutes);
        app.use(StatusRoutes);
        app.use(ErrorsRoutes);
        
        server = app.listen(5000);
    }

    process.on("SIGTERM", onShutDownServer);
    process.on("SIGINT", onShutDownServer);
}

export default initializeServer;