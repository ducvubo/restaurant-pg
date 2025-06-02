import React, { Suspense } from 'react'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
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
import { columns } from './_component/Columns'
import { PageFoods } from './_component/PageFoods'
import LogoutPage from '@/app/logout/page'
import { IFood } from './food.interface'
import { getAllFoods } from './food.api'
import { Card } from '@/components/ui/card'
import ErrorPage from '@/components/ErrorPage'
interface PageProps {
  searchParams: { [key: string]: string }
}

async function Component({ searchParams }: PageProps) {
  const res: IBackendRes<IModelPaginate<IFood>> = await getAllFoods({
    current: searchParams.page ? searchParams.page : '1',
    pageSize: searchParams.size ? searchParams.size : '10',
    food_name: searchParams.search ? searchParams.search : '',
    type: 'all'
  })

  if (res.code === -10) {
    return <LogoutPage />
  }
  if (res.code === -11) {
    return <ToastServer message='Bạn không có quyền truy cập' title='Lỗi' variant='destructive' />
  }
  if (!res || !res.data) {
    return (
      <ErrorPage />
    )
  }
  const data = res.data.result.flat()

  return (
    <ContentLayout title='Danh sách món ăn online'>
      <PageFoods data={data} columns={columns} meta={res.data.meta} />
    </ContentLayout>
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
