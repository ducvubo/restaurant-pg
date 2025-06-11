'use client'
import React from 'react'
import { IUnit } from '../unit.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ViewUnitProps {
  inforUnit: IUnit
}

export default function ViewUnit({ inforUnit }: ViewUnitProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/dashboard/units/edit?id=${inforUnit.unt_id}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên đơn vị đo</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforUnit.unt_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ký hiệu</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforUnit.unt_symbol}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforUnit.unt_description}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}