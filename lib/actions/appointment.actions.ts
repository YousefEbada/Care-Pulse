'use server'
import { ID, Query } from "node-appwrite";

import { databases } from "../appwrite.config"; 
import { revalidatePath } from "next/cache";
export const createAppointmet=async(appointment:CreateAppointmentParams)=>{
    try{
        
    // console.log("env", process.env);

    // console.log("📦 Creating patient with payload:",appointment );

    const newAppointment = await databases.createDocument(
      process.env.DATABASE_ID!,
      process.env.APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    // console.log("✅ Patient created:", newAppointment);

    return JSON.parse(JSON.stringify(newAppointment));

    }
    catch(error){
        console.log(error)
    }
}

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      process.env.DATABASE_ID!,
      process.env.APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return JSON.parse(JSON.stringify(appointment));
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing patient:",
      error
    );
  }
};
export const getRecentAppointmentsList = async () => {
  try {
    const appointments = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")
      ]
    );
    const initialCounts={
      scheduledCount:0,
      pendingCount:0,
      cancelledCount:0
    }
    const counts=(appointments.documents as Appointment[]).reduce((acc, appointment) => {
      if(appointment.status==="scheduled"){
        acc.scheduledCount+=1
      }
      else if(appointment.status==="pending"){
        acc.pendingCount+=1
      }
      else if(appointment.status==="cancelled"){
        acc.cancelledCount+=1
      }
      return acc

    }, initialCounts)

    const data={
      totalCount: appointments.total,
      ...counts,
      documents:appointments.documents
    }
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async ({appointmentId,userId,appointment,type}:UpdateAppointmentParams)=>{
console.log("updateAppointment params:", {appointmentId,userId,appointment,type});
 try {
    // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedAppointment = await databases.updateDocument(
      process.env.DATABASE_ID!,
      process.env.APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw Error;

    // const smsMessage = `Greetings from CarePulse. ${type === "schedule" ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!, timeZone).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!, timeZone).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`}.`;
    // await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    console.log("✅ Appointment updated:", updatedAppointment);
    return JSON.parse(JSON.stringify(updatedAppointment));
  }
  catch(error){
    console.log(error)
  }

}