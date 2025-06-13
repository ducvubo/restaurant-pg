'use client'
import React from 'react'
import { IInternalProposal } from '../internal-proposal.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { usePermission } from '@/app/auth/PermissionContext'
interface ViewInternalProposalProps {
  inforInternalProposal: IInternalProposal
}

export default function ViewInternalProposal({ inforInternalProposal }: ViewInternalProposalProps) {
  const router = useRouter()
  const { hasPermission } = usePermission()
  const handleEdit = () => {
    router.push(`/dashboard/internal-proposal/edit?id=${inforInternalProposal.itn_proposal_id}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermission('internal_proposal_update')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tiêu đề đề xuất</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforInternalProposal.itn_proposal_title}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Loại đề xuất</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforInternalProposal.itn_proposal_type}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Nội dung</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforInternalProposal.itn_proposal_content}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}