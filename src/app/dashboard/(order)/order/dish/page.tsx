import { ContentLayout } from '@/components/admin-panel/content-layout'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import React from 'react'
import ListOrderPage from '../_component/ListOrderPage'

export default function PageListOrder() {
  return (
    <ContentLayout title='Danh sách đơn đặt hàng'>
      <ListOrderPage />
    </ContentLayout>
  )
}
