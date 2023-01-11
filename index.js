import DatabaseConfig from "./config/database.js";
import initializeExpressServer from "./config/express.js";

(async function initialize() {
    if (await DatabaseConfig.openDbConnection()) {
        if (await DatabaseConfig.connectToDb()) {
            initializeExpressServer();
        } else {
            await DatabaseConfig.closeDbConnection();
        }
        await DatabaseConfig.closeDbConnection();
    } else {
        await DatabaseConfig.closeDbConnection();
    }
})();