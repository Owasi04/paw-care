import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

await client.connect();

export const dbConnect = (collection) => {
  const database = process.env.DB_NAME;
  return client.db(database).collection(collection);
};