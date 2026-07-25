import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("Please define the MONGO_URI environment variable");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Reuse a global connection in development to avoid exhausting connections
  // across hot reloads.
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export const dbConnect = async (collection) => {
  // Ensure the client is connected before returning a collection.
  await clientPromise;
  const database = process.env.DB_NAME;
  return client.db(database).collection(collection);
};
