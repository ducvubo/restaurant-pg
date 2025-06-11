'use client'
import React from 'react'
import { ITable } from '../table.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ViewTableProps {
  inforTable: ITable
}

export default function ViewTable({ inforTable }: ViewTableProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/dashboard/tables/edit?id=${inforTable._id}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên bàn</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforTable.tbl_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Số lượng khách</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforTable.tbl_capacity}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforTable.tbl_description}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}