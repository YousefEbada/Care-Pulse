import React from 'react'
import { Button } from './button'
import Image from 'next/image'
interface ButtonProps {
    isLoading?:boolean,
    className?:string,
    children?:React.ReactNode
}

const SubmitButton = ({isLoading,className,children}:ButtonProps) => {
  return (
    <Button type='submit' disabled={isLoading} className={className??'shad-primary-btn w-full'} >
        {isLoading ? (
            <div className='flex items-center gab-4'>
                <Image
                src="/assets/icons/loader.svg"
                height={24}
                width={24}
                alt="loader"
                className="animate-spin"
              />
              loading ...
            </div>
        ):(
            children
        )
        }
    </Button>
  )
}

export default SubmitButton