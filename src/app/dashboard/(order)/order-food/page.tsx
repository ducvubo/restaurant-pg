import React from 'react'
import BookTablePage from './_component/OrderFoodPage'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'

export default function PageBookTable() {
  return (
    <div>
      <ContentLayout title='Danh sách đặt món ăn'>
        <BookTablePage />
      </ContentLayout>
    </div>
  )
}
