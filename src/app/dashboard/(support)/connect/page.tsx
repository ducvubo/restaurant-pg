import { ContentLayout } from '@/components/admin-panel/content-layout'
import React from 'react'
import PageConnect from './_component/PageConnect'

export default function page() {
  return (
    <ContentLayout title="Tin nhắn với khách hàng">
      <PageConnect />
    </ContentLayout>
  )
}
