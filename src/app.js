import { openDbConnection } from "./config/database.js";
import initializeExpressServer from "./config/express.js";
import { removeDisconnectedUsers } from "./services/user.js";

(async function initialize() {
    openDbConnection(async (error) => {
        if (error) throw Error("Falha ao conectar ao banco de dados!");
        else {
            initializeExpressServer();
            await removeDisconnectedUsers();
        }
    });
})();