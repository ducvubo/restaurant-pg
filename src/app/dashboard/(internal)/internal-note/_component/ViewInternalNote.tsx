'use client'
import React from 'react'
import { IInternalNote } from '../internal-note.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ViewInternalNoteProps {
  inforInternalNote: IInternalNote
}

export default function ViewInternalNote({ inforInternalNote }: ViewInternalNoteProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/dashboard/internal-note/edit?id=${inforInternalNote.itn_note_id}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tiêu đề ghi chú</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforInternalNote.itn_note_title}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Loại ghi chú</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforInternalNote.itn_note_type}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Nội dung</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforInternalNote.itn_note_content}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}