"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
// import { Button } from "@/components/ui/button"
import { FormFieldType } from "./PatientForm"
import {
  Form,
 
} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
// import { CreateAppointmentSchema, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
// import { CreateUser } from "@/lib/actions/patient.actions"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import{ getAppointmentSchema}from "@/lib/validation"
import { createAppointmet, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"


 
export function AppointmentForm({type,userId,patientId,appointment,setOpen}:{type:"create"|"cancel"|"schedule";userId:string;patientId:string; appointment?:Appointment; setOpen:(open: boolean) => void;}) {
  const router=useRouter();
  const [isLoading, setIsLoading] = useState(false) 
  const AppointmentFormValidation=getAppointmentSchema(type)
  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
  defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    // console.log(patientId,"patientId")
    let status;
 
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }
    console.log(type,"type")

    try {
     if(type==="create"&& patientId){
        const appointmentData={
          userId,
          patient:patientId,
          primaryPhysician:values.primaryPhysician,
          reason:values.reason!,
          schedule:new Date(values.schedule),
          status:status as Status,
          note:values.note
        }
        const appointment=await createAppointmet(appointmentData)
        console.log(appointment,"appointment")
        if(appointment){
            form.reset();
             router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
           
        }
     }
     else {
        console.log("update")
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };
        console.log("appointmentToUpdate", appointmentToUpdate)
        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
     
    } catch (error) {
      console.error(error)
    }
  }
  let buttonLabel;
//  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Apppointment";
  }
  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type==="create"&&<section className="mb-12 space-y-4">
          <h1 className="header">New appointment</h1>
          <p className="text-dark-700">request an appointment</p>
        </section>
        }
        {type!=="cancel"&&
        <>
            <CustomFormField control={form.control} fieldType={FormFieldType.SELECT}
          name="primaryPhysician"
          label="doctor"
          placeholder="Select a doctor"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2">
                
                <Image
                  src={doctor.image}
                  height={32}
                  width={32}
                  alt={doctor.name}
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField 
        control={form.control}
        fieldType={FormFieldType.DATE_PICKER}
        name="schedule"
        label="expected date"
        showTimeSelect
        dateFormat="MM/dd/yyyy h:mm aa"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="reason"
            label="reason for appointment"
            placeholder="enter your reason"/>

            <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="note"
            label="Note"
            placeholder="enter notes"/>
        </div>
        </>
        }
        {
          type==="cancel"&&
          <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="cancellationReason"
          label="reason for cancellation"
          placeholder="enter your reason"
          />
        }
        
        
        <SubmitButton isLoading={isLoading} className={`${type==='cancel'?'shad-danger-btn':'shad-primary-btn'} w-full`} >{buttonLabel}</SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm