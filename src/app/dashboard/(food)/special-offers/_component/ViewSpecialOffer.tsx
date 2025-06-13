'use client'
import React from 'react'
import { ISpecialOffer } from '../special-offer.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { usePermission } from '@/app/auth/PermissionContext'
interface ViewSpecialOfferProps {
  inforSpecialOffer: ISpecialOffer
}

export default function ViewSpecialOffer({ inforSpecialOffer }: ViewSpecialOfferProps) {
  const router = useRouter()
  const { hasPermission } = usePermission()
  const handleEdit = () => {
    router.push(`/dashboard/special-offers/edit?id=${inforSpecialOffer.spo_id}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermission('special_offer_update')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên ưu đãi</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforSpecialOffer.spo_title}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              <div dangerouslySetInnerHTML={{ __html: inforSpecialOffer.spo_description || 'Chưa có mô tả' }} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}