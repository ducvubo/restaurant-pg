'use client'
import React from 'react'
import { ISupplier } from '../supplier.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ViewSupplierProps {
  inforSupplier: ISupplier
}

export default function ViewSupplier({ inforSupplier }: ViewSupplierProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/dashboard/suppliers/edit?id=${inforSupplier.spli_id}`)
  }

  const typeDisplay = inforSupplier.spli_type ? {
    supplier: 'Nhà cung cấp',
    customer: 'Khách hàng'
  }[inforSupplier.spli_type] : 'Không xác định'

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên nhà cung cấp</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforSupplier.spli_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Email</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforSupplier.spli_email}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Số điện thoại</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforSupplier.spli_phone}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Địa chỉ</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforSupplier.spli_address}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforSupplier.spli_description}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Loại</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{typeDisplay}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}