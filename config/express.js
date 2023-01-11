import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";

import { closeDbConnection } from "./database.js";

import ErrorsRoutes from "../routes/errors.js";

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

        app.use(ErrorsRoutes);
        
        server = app.listen(process.env.APP_PORT);
    }

    process.on("SIGTERM", onShutDownServer);
    process.on("SIGINT", onShutDownServer);
}

export default initializeServer;