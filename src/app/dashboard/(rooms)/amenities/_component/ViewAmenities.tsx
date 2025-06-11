'use client'
import React from 'react'
import { IAmenities } from '../amenities.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ViewAmenitiesProps {
  inforAmenities: IAmenities
}

export default function ViewAmenities({ inforAmenities }: ViewAmenitiesProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/dashboard/amenities/edit?id=${inforAmenities.ame_id}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên dịch vụ</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforAmenities.ame_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Giá dịch vụ</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforAmenities.ame_price?.toLocaleString()} VND</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ghi chú</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforAmenities.ame_note || 'Chưa có ghi chú'}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforAmenities.ame_description || 'Chưa có mô tả'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}