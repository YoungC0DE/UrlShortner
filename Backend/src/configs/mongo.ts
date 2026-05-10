import { Db, MongoClient } from "mongodb";
import env from "./env";

const client = new MongoClient(env.MONGO_URL);

let db: Db;

export async function connectMongo() {
  await client.connect();

  db = client.db(env.MONGO_DATABASE);

  await db.collection("urls").createIndex(
    { code: 1 },
    { unique: true }
  );

  console.log("MongoDB connected");
}

export function getDb() {
  return db;
}