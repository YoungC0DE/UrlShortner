import { Db, MongoClient } from "mongodb";
import env from "./env";

const client = new MongoClient(env.MONGO_URL);

let db: Db;

export async function connectMongo() {
  await client.connect();

  db = client.db(env.MONGO_DATABASE);

  const urls = db.collection("urls");

  await urls.createIndex({ code: 1 }, { unique: true });

  /** Links without expires_at (legacy): set from created_at + 6 months for TTL + redirect rules. */
  await urls.updateMany(
    { expires_at: { $exists: false }, created_at: { $exists: true } },
    [
      {
        $set: {
          expires_at: {
            $dateAdd: {
              startDate: "$created_at",
              unit: "month",
              amount: 6,
            },
          },
        },
      },
    ]
  );

  /**
   * Deletes documents shortly after expires_at passes (MongoDB TTL monitor, ~60s).
   * expireAfterSeconds: 0 → delete when the indexed date is reached.
   */
  await urls.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });

  console.log("MongoDB connected");
}

export function getDb() {
  return db;
}