import { ContentLayout } from '@/components/admin-panel/content-layout'
import React from 'react'
import PageAccount from './_component/PageAccount'

export default function page() {
  return (
    <ContentLayout title='Thông tin'>
      <PageAccount />
    </ContentLayout>
  )
}
