import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

let mongoConnection = null;
let db = null;

const openDbConnection = (callback) => {
    if (!mongoConnection) {
        mongoConnection = new MongoClient(process.env.DATABASE_URL, { useUnifiedTopology: true });
        mongoConnection.connect().then((client) => {
            db = client.db();
            callback(null);
        }).catch((error) => {
            callback(error);
        });
    }
};

const getDbInstance = () => {
    if (!db) throw Error("Banco de dados não inicializado!");
    return db;
};

const closeDbConnection = (callback) => {
    if (mongoConnection) {
        mongoConnection.close().then((client) => {
            db = client;
            callback(null);
        });
    }
};

export { openDbConnection, getDbInstance, closeDbConnection };