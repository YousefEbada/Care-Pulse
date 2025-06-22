  import RegisterForm from '@/components/forms/RegisterForm'
  import { GetUser } from '@/lib/actions/patient.actions'
  import Image from 'next/image'
  import Link from 'next/link'
  import React from 'react'


  const register = async({ params :{userId}}:SearchParamProps) => {
    // console.log("params.userId:", userId); 
      const user=await GetUser(userId);
      // console.log(user,"userrrrrrrrrrr")
    return (
    <div className="flex min-h-screen max-h-screen ">

        <section className="remove-scrollbar container ">
          <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
            <Image
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="patient"
              className="mb-12 h-10 w-fit"
              
            />
            <RegisterForm user={user} />
            <div className="text-14-regular mt-20 flex justify-between">
              <p className="copyright py-12">© 2025 CarePulse</p>

            </div>
            
          </div>
        </section>
        <Image
    src="/assets/images/register-img.png"
    height={1000}
    width={1000}
    alt="patient"
    className="side-img max-w-[35%] h-full object-cover max-h-screen "
  />

      </div>
    )
  }

  export default register