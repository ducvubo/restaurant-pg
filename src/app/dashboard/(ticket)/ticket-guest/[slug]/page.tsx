import React from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import PageDetailTicket from '../_component/PageDetailTicket'

export default function page() {
  return (
    <div>
      <ContentLayout title='Chi tiết hỏi đáp'>
        <PageDetailTicket />
      </ContentLayout>
    </div>
  )
}
