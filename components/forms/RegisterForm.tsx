"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
} from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../ui/SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { RegisterPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { RadioGroup } from "@radix-ui/react-radio-group";

export function RegisterForm({ user }: { user: User }) {
  // console.log("User object:", user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      primaryPhysician: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  // console.log("Form errors:", form.formState.errors); // ✅ Debug form errors

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    // console.log("onSubmit triggered"); // ✅ Debug
    setIsLoading(true);
    // console.log("Submitted values:", values);

    let formData;
    try {
      if (values.identificationDocument && values.identificationDocument.length > 0) {
        // console.log("📁 Uploading identificationDocument...");
        const file = values.identificationDocument[0];
        const blobFile = new Blob([file], {
          type: file.type,
        });

        formData = new FormData();
        formData.append("blobFile", blobFile);
        formData.append("fileName", file.name);
        for (const pair of formData.entries()) {
  // console.log(`${pair[0]}:`, pair[1]);
}

      }

      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };
      // console.log("RegisterPatient params:", patientData);
      // @ts-ignore
      const patient = await RegisterPatient(patientData);
      console.log("Patient ID:", patient.$id, "Name:", patient);

      if (patient && patient.$id) {
        router.push(`/patients/${patient.$id}/new-appointment`);
      } else {
        alert("Something went wrong. Patient not returned.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about you</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <CustomFormField control={form.control} fieldType={FormFieldType.INPUT}
          name="name"
          placeholder="shadcn"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user icon"
          label="Full Name"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT}
            name="email"
            label="Email"
            placeholder="johndoe@example.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email icon"
          />
          <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT}
            name="phone"
            label="Phone Number"
            placeholder="+20 1153971557"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.DATE_PICKER}
            name="birthDate"
            label="Date of Birth"
            placeholder="01/01/2000"
          />
          <CustomFormField control={form.control} fieldType={FormFieldType.SKELETON}
            name="gender"
            label="Gender"
            renderSkeleton={(field: any) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  {GenderOptions.map((option, i) => (
                    <div key={option + i} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT}
            name="address"
            label="Address"
            placeholder="Nasr City, Cairo"
          />
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Mohammad"
          />
          <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="+20 1153971557"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        <CustomFormField control={form.control} fieldType={FormFieldType.SELECT}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a physician"
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

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="Aetna"
          />
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="Abc123"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA}
            name="allergies"
            label="Allergies"
            placeholder="Peanuts"
          />
          <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA}
            name="currentMedication"
            label="Current Medication"
            placeholder="Aspirin"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="Mother with diabetes"
          />
          <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="Appendectomy"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        <CustomFormField control={form.control} fieldType={FormFieldType.SELECT}
          name="identificationType"
          label="Identification Type"
          placeholder="Select identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField control={form.control} fieldType={FormFieldType.INPUT}
          name="identificationNumber"
          placeholder="123456789"
          label="Identification Number"
        />

        <CustomFormField control={form.control} fieldType={FormFieldType.SKELETON}
          name="identificationDocument"
          label="Upload Your Identification Document"
          renderSkeleton={(field: any) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>

        <CustomFormField control={form.control} fieldType={FormFieldType.CHECKBOX}
          name="treatmentConsent"
          label="I consent to receive treatment"
        />
        <CustomFormField control={form.control} fieldType={FormFieldType.CHECKBOX}
          name="disclosureConsent"
          label="I consent to disclose my information"
        />
        <CustomFormField control={form.control} fieldType={FormFieldType.CHECKBOX}
          name="privacyConsent"
          label="I consent to the privacy policy"
        />

        <SubmitButton isLoading={isLoading}>Get started</SubmitButton>

        {/* Optional: Show validation errors for debugging */}
        {Object.keys(form.formState.errors).length > 0 && (
          <pre className="text-red-500 bg-red-100 p-4 mt-4 rounded">
            {JSON.stringify(form.formState.errors, null, 2)}
          </pre>
        )}
      </form>
    </Form>
  );
}

export default RegisterForm;
