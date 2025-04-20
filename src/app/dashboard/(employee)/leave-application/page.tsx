import React from 'react'
import PageLeaveApplication from './_component/PageLeaveApplication'
import { ContentLayout } from '@/components/admin-panel/content-layout'

export default function page() {
  return (
    <ContentLayout title="Đơn xin nghỉ phép">
      <PageLeaveApplication />
    </ContentLayout>
  )
}
