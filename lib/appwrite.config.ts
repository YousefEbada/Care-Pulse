// 'use server';
import * as sdk from "node-appwrite";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
   ENDPOINT,
} = process.env;
console.log("📦 ENV TEST", JSON.stringify(process.env, null, 2));


if (!PROJECT_ID || !API_KEY || !ENDPOINT) {
  console.error("❌ Missing required environment variables:");
  console.error({ PROJECT_ID, API_KEY, ENDPOINT });
  throw new Error("Environment setup error: Check .env.local");
}

const client = new sdk.Client();

client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
console.log(users)
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);