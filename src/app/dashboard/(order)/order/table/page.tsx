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
import ListTablePage from '../_component/ListTablePage'

export default function page() {
  return (
    <ContentLayout title='Danh sách đơn hàng theo bàn'>
      <ListTablePage />
    </ContentLayout>
  )
}
