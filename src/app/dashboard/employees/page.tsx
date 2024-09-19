import React from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import PlaceholderContent from '@/components/demo/placeholder-content'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import AddOrEdit from './_component/AddOrEdit'
import PageEmployees from './_component/PageEmployees'
export default function Page() {
  return (
    <ContentLayout title='Thêm nhân viên'>
      <Breadcrumb className='-mt-4'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/dashboard'>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Danh sách nhân viên</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageEmployees />
    </ContentLayout>
  )
}
