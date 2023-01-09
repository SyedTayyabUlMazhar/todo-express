import { AnyError, Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.MONGO_ACCESS ?? "";
const client = new MongoClient(connectionString);

let db: Db;

export const connectToServer = async () => {
  try {
    const mongoClient = await client.connect();
    db = mongoClient.db("testdb");
    console.log("Successfully connected to MongoDB.");
    return { success: true };
  } catch (e) {
    return { success: false, error: e as AnyError };
  }
};

export const getDb = function () {
  return db;
};
