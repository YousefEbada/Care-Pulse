"use server";
import { ID, Query } from "node-appwrite"
import { databases, storage, users } from "../appwrite.config";
import {InputFile} from "node-appwrite/file";
import {BUCKET_ID} from "../appwrite.config";
export const CreateUser = async (user: CreateUserParams) => {
  try {
    console.log("📦 Creating user with payload:", user);
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    )
    console.log(newUser,"newUser")
    return newUser; // ✅ Fix: return the created user
  } catch (error: any) {
  console.error("❌ CreateUser error:", error);

  if (error?.code === 409) {
    const documents = await users.list([
      Query.equal("email", user.email)
    ]);
    return documents?.users?.[0];
  }

    console.error("CreateUser failed:", error);
    return null;
  }
}
export const GetUser = async (userId: string) => {
  console.log(userId,"userrrrrrrrrrrid")
try{
  const user = await users.get(userId);
  // console.log(user,"user in patient")
  return JSON.parse(JSON.stringify(user))

}
catch(error){
  console.log(error)
  // console.log("nouserrrrrrrrr")
}
}
export const GetPatient = async (userId: string) => {
  console.log(userId,"userrrrrrrrrrrid")
try{
  // console.log(process.env.DATABASE_ID!,process.env.PATIENT_COLLECTION_ID!,"env")
  const patients = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.PATIENT_COLLECTION_ID!,
      [Query.equal("$id", userId)]
    ); 
    // console.log(patients,"user in patient")
    // console.log(patients.documents.length, "📦 patient count");
// console.log(patients.documents[0], "📄 patient document");
  return JSON.parse(JSON.stringify(patients))

}
catch(error){
  console.log(error)
  // console.log("nouserrrrrrrrr")
}
}


export const RegisterPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    // console.log("env", process.env); 

  // console.log("RegisterPatient params:", { identificationDocument, ...patient });

  try {
    // console.log("🔍 Starting RegisterPatient...");

    let file;
    if (identificationDocument) {
      // console.log("📁 Uploading identificationDocument...");
      const blob = identificationDocument.get("blobFile");
      const fileName = identificationDocument.get("fileName") as string;

      if (!blob || !(blob instanceof Blob)) {
        throw new Error("📛 blobFile is missing or not a Blob");
      }

      const inputFile = InputFile.fromBuffer(
        await blob.arrayBuffer(), // You may need to wrap this in Buffer.from(...) if using Node
        fileName
      );
    // console.log("env", process.env); 

      file = await storage.createFile(process.env.BUCKET_ID!, ID.unique(), inputFile);
      // console.log("✅ File uploaded:", file);
    }
    //log env vals
    // console.log("env", process.env); 
    const payload = {
      identificationDocumentId: file?.$id,
      identificationDocumentUrl: file
        ? `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.BUCKET_ID}/files/${file?.$id}/view?project=${process.env.PROJECT_ID}`
        : undefined,
      ...patient,
    };
    // console.log("env", payload);

    // console.log("📦 Creating patient with payload:", payload);

    const newPatient = await databases.createDocument(
      process.env.DATABASE_ID!,
      process.env.PATIENT_COLLECTION_ID!,
      ID.unique(),
      payload
    );

    // console.log("✅ Patient created:", newPatient);

    return JSON.parse(JSON.stringify(newPatient));
  } catch (error: any) {
    console.error("❌ RegisterPatient error:", error.message);
    console.error("💥 Full error object:", error);
    return null;
  }
};
