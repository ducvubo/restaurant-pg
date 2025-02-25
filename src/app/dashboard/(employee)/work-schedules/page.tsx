import { ContentLayout } from '@/components/admin-panel/content-layout'
import React from 'react'
import PageWorkSchedule from './_component/PageWorkSchedule'
import AddOrEdit from './_component/AddOrEdit'

export default function page() {
  return (
    <ContentLayout title='Danh sách lịch làm việc'>
      <PageWorkSchedule />
      {/* <AddOrEdit id="add"/> */}
    </ContentLayout>
  )
}
