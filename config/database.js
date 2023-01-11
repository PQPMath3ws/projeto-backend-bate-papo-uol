import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

let mongoConnection = null;
let db = null;

const DatabaseConfig = {
    db,
    openDbConnection: async function() {
        try {
            if (!mongoConnection) {
                mongoConnection = new MongoClient(process.env.DATABASE_URL);
                await mongoConnection.connect();
            }
            return true;
        } catch (_) {
            return false;
        }
    },
    connectToDb: async function() {
        try {
            if (!db) {
                db = await mongoConnection.db();
            }
            return true;
        } catch(_) {
            return false;
        }
    },
    closeDbConnection: async function() {
        try {
            if (mongoConnection) {
                await mongoConnection.close();
            }
            return true;
        } catch (_) {
            return false;
        }
    },
};

export default DatabaseConfig;