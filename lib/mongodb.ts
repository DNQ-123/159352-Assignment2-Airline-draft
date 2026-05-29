import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const client = new MongoClient(uri);

export async function getDb() {
  await client.connect();
  return client.db("assignment2_airline");
}