import React from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import PageDashboard from './PageDashboard'

export default function PageBookTable() {
  return (
    <ContentLayout title='Tổng quan'>
      <PageDashboard />
    </ContentLayout>
  )
}