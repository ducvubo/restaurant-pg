import React from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import PageTicketGuest from './_component/PageTicketGuest'

export default function page() {
  return (
    <div>
      <ContentLayout title='Danh sách hỏi đáp'>
        <PageTicketGuest />
      </ContentLayout>
    </div>
  )
}
