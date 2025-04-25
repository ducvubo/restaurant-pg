import React from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import BookRoomPage from './_component/BookRoomPage'

export default function PageBookRoom() {
  return (
    <div>
      <ContentLayout title='Danh sách đặt phòng'>
        <BookRoomPage />
      </ContentLayout>
    </div>
  )
}
