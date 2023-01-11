import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";

import DatabaseConfig from "./database.js";

import ErrorsRoutes from "../routes/errors.js";

dotenv.config();

const app = express();
let server = null;

async function onShutDownServer() {
    if (server) {
        await DatabaseConfig.closeDbConnection();
        server.close(() => {
            process.exit(0);
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