"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
// import { Button } from "@/components/ui/button"
import {
  Form,
 
} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { CreateUser } from "@/lib/actions/patient.actions"
export enum FormFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA="textarea",
  PHONE_INPUT="phoneInput",
  DATE_PICKER="datePicker",
  SELECT="select",
  SKELETON="skeleton"
}
 

 
export function PatientForm() {
  const router=useRouter();
  const [isLoading, setIsLoading] = useState(false) 
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit({name,email,phone}: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    console.log("loading")
    try {
      const userData={
        name,
        email,
        phone
      }
      console.log(userData)
      const user=await CreateUser(userData);
      console.log(user)
      if(user){
        setIsLoading(false);
        router.push(`/patients/${user.$id}/register`)
      }

    } catch (error) {
      console.error(error)
    }
  }
  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">scedule your first apointment</p>
        </section>
        <CustomFormField control={form.control} fieldType={FormFieldType.INPUT}
        name="name"
        label="Fullname"
        placeholder="shadcn"
        iconSrc="/assets/icons/user.svg"
        iconAlt="user icon" />
         <CustomFormField control={form.control} fieldType={FormFieldType.INPUT}
        name="email"
        label="Email"
        placeholder="johndoe@example.com"
        iconSrc="/assets/icons/email.svg"
        iconAlt="email icon" />
        <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT}
        name="phone"
        label="Phone number"
        placeholder="+20 1153971557"
        />
        <SubmitButton isLoading={isLoading} >Get started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm