import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import ToastServer from '@/components/ToastServer'

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
import LogoutPage from '@/app/logout/page'
import InforPage from './_component/InforPage'
interface PageProps {
  searchParams: { [key: string]: string }
}

async function Component({ searchParams }: PageProps) {
  return (
    <div>
      <ContentLayout title='Thông tin nhà hàng'>
        <InforPage />
      </ContentLayout>
    </div>
  )
}

export default function Page(props: PageProps) {
  return (
    <div>
      <Suspense fallback={<LoadingServer />}>
        <Component {...props} />
      </Suspense>
    </div>
  )
}
