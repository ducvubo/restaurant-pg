'use client'
import React from 'react'
import { IOperationalCosts } from '../operational-costs.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ViewOperationalCostsProps {
  inforOperationalCosts: IOperationalCosts
}

export default function ViewOperationalCosts({ inforOperationalCosts }: ViewOperationalCostsProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/dashboard/operational-costs/edit?id=${inforOperationalCosts.opera_cost_id}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Loại chi phí</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforOperationalCosts.opera_cost_type}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Số tiền</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforOperationalCosts.opera_cost_amount.toLocaleString()} VND</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ngày phát sinh</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforOperationalCosts.opera_cost_date
                ? new Date(inforOperationalCosts.opera_cost_date).toLocaleDateString('vi-VN')
                : 'Chưa thiết lập'}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả chi phí</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforOperationalCosts.opera_cost_description || 'Chưa có mô tả'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}