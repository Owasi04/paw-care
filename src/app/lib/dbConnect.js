const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGO_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export const dbConnect = (collection) => {
  const dbName = process.env.DB_NAME;
  return client.db(dbName).collection(collection);
};
