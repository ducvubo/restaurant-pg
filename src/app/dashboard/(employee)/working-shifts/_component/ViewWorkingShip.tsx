'use client'
import React from 'react'
import { IWorkingShift } from '../working-shift.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ViewWorkingShiftProps {
  inforWorkingShift: IWorkingShift
}

export default function ViewWorkingShift({ inforWorkingShift }: ViewWorkingShiftProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/dashboard/working-shifts/edit?id=${inforWorkingShift.wks_id}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên ca làm việc</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforWorkingShift.wks_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giờ bắt đầu</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforWorkingShift.wks_start_time}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giờ kết thúc</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforWorkingShift.wks_end_time}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforWorkingShift.wks_description}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}