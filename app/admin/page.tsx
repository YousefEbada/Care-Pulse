// 'use server'
import {DataTable} from '@/components/table/DataTable'
import { StatCard } from '@/components/StatCard'
import { getRecentAppointmentsList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {columns} from '@/components/table/Columns'

const Admin = async() => {
    const appointments = await getRecentAppointmentsList();
    // console.log(appointments)
  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
        <header className='admin-header'>
            <Link href="/" className='cursor-pointer'>
                <Image src="/assets/icons/logo-full.svg" height={32} width={162} alt="logo" className="h-8 w-fit" />    
            </Link>
            <p className='text-16-semibold'>Admin Dashboard</p>
        </header>
        <main className='admin-main'>
            <section className='w-full space-y-4'>
                <h1 className='header'>Welcome  👋 </h1>
                <p className='text-dark-700'>Start managing your patients</p>
            </section>
            <section className='admin-stat'>
                <StatCard count={appointments.scheduledCount} label="Scheduled appointments" icon="/assets/icons/appointments.svg" type="appointments" />
                <StatCard count={appointments.pendingCount} label="Pending" icon="/assets/icons/pending.svg" type="pending" />
                <StatCard count={appointments.cancelledCount} label="Cancelled" icon="/assets/icons/cancelled.svg" type="cancelled" />
            </section>
            {/* <DataTable data={appointments.documents} columns={Columns} />
             */}
             <DataTable data={appointments.documents} columns={columns} />

        </main>
    </div>
  )
}

export default Admin