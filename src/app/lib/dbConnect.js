import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect once when the module loads
let isConnected = false;

export const dbConnect = async (collection) => {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  const dbName = process.env.DB_NAME;
  return client.db(dbName).collection(collection);
};
