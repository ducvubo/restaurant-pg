'use client'
import React from 'react'
import { ILabel } from '../label.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { hasPermissionKey } from '@/app/dashboard/policy/PermissionCheckUtility'

interface ViewLabelProps {
  inforLabel: ILabel
}

export default function ViewLabel({ inforLabel }: ViewLabelProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/dashboard/labels/edit?id=${inforLabel.lb_id}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermissionKey('label_list_update')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tên nhãn</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforLabel.lb_name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforLabel.lb_description}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Màu</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              <div className='flex items-center gap-2'>
                <div
                  className='w-6 h-6 rounded-md'
                  style={{ backgroundColor: inforLabel.lb_color }}
                ></div>
                <span>{inforLabel.lb_color}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}