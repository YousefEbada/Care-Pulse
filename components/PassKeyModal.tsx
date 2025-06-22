'use client'
import React, { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "@/components/ui/alert-dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

// import { encryptKey } from '@/lib/utils';
const PassKeyModal = () => {
    const router = useRouter();
    
    const [open, setOpen] = useState(true);
    const [passKey, setPassKey] = useState("");
    const [error, setError] = useState("");
    const encryptedKey=typeof window !== "undefined" ? window.localStorage.getItem("accessKey"):null;
    const path=usePathname();
    useEffect(() => {
        const accesssKey=encryptedKey? atob(encryptedKey):"";
        if (path){
            if(accesssKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY){
            // const encryptKey=encryptKey(passKey);
            
            setOpen(false);
            router.push("/admin")
        }
        else{
            setOpen(true);
        }
        }
    }, [encryptedKey])
    const validatePassKey = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if(passKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY){
            // const encryptKey=encryptKey(passKey);
            const encryptedKey=btoa(passKey);
            localStorage.setItem("accessKey",encryptedKey);
            setOpen(false);
            router.push("/admin")
        }
        else{
            setError("Invalid Passkey, Please try again")
        }
    }
    const closeModal = () => {setOpen(false)
    router.push("/")
    };

    
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent className='shad-alert-dialog'>
    <AlertDialogHeader>
      <AlertDialogTitle className='flex items-start justify-between'>Admin Access verification
        <Image src="/assets/icons/close.svg" height={20} width={20} alt="close" onClick={() => closeModal()} className='cursor-pointer' />
      </AlertDialogTitle>
      <AlertDialogDescription>
       To access admin dashboard please enter the passkey.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <div >
        <InputOTP maxLength={6} value={passKey} onChange={(value) => setPassKey(value)}>
  <InputOTPGroup className='shad-otp'>
    <InputOTPSlot index={0} className='shad-otp-slot' />
    <InputOTPSlot index={1}  className='shad-otp-slot'/>
    <InputOTPSlot index={2} className='shad-otp-slot' />
 
    <InputOTPSlot index={3}  className='shad-otp-slot'/>
    <InputOTPSlot index={4} className='shad-otp-slot' />
    <InputOTPSlot index={5}  className='shad-otp-slot'/>
  </InputOTPGroup>
</InputOTP>
        {error && <p className="shad-error text-14-regular mt-4 flex justify-center">{error}</p>}
    </div>
    <AlertDialogFooter>
      <AlertDialogAction onClick={(e) =>validatePassKey(e) } className='shad-primary-btn w-full'>Enter Admin passKey</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}

export default PassKeyModal