'use client'
import React from 'react'
import { IOperationManual } from '../operation-manual.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { usePermission } from '@/app/auth/PermissionContext'
interface ViewOperationManualProps {
  inforOperationManual: IOperationManual
}

export default function ViewOperationManual({ inforOperationManual }: ViewOperationManualProps) {
  const router = useRouter()
  const { hasPermission } = usePermission()
  const handleEdit = () => {
    router.push(`/dashboard/operation-manual/edit?id=${inforOperationManual.opera_manual_id}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermission('operation_manual_update')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tiêu đề tài liệu</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforOperationManual.opera_manual_title}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Loại tài liệu</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforOperationManual.opera_manual_type}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ghi chú</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforOperationManual.opera_manual_note || 'Chưa có ghi chú'}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Nội dung</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              <div dangerouslySetInnerHTML={{ __html: inforOperationManual.opera_manual_content || 'Chưa có nội dung' }} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}