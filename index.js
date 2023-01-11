import initializeExpressServer from "./config/express.js";

import { openDbConnection } from "./config/database.js";

(function initialize() {
    openDbConnection((error) => {
        if (error) throw Error("Falha ao conectar ao banco de dados!");
        else {
            initializeExpressServer();
        }
    });
})();