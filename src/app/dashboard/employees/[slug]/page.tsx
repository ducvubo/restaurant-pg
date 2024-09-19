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
import React from 'react'
import AddOrEdit from '../_component/AddOrEdit'

export default function Add() {
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
            <BreadcrumbPage>Thêm nhân viên</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <AddOrEdit />
    </ContentLayout>
  )
}
