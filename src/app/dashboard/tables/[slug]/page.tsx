import { ContentLayout } from '@/components/admin-panel/content-layout'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import AddOrEdit from '../_component/AddOrEdit'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ITable } from '../table.interface'
import { findTableById, getAllTables } from '../table.api'
import { PageTables } from '../_component/PageTables'
import { columns } from '../_component/Columns'
import LogoutPage from '@/app/logout/page'
import ErrorPage from '@/components/ErrorPage'
import ViewTable from '../_component/ViewTable'

const ToastServer = dynamic(() => import('@/components/ToastServer'), {
  ssr: false
})

interface PageProps {
  searchParams: { [key: string]: string }
  params: { slug: string }
}

async function Component({ searchParams, params }: PageProps) {
  const id = params.slug
  if (id === 'add') {
    return (
      <ContentLayout title='Thêm bàn ăn'>
        <AddOrEdit id='add' />
      </ContentLayout>
    )
  }

  if (id === 'recycle') {
    const res: IBackendRes<IModelPaginate<ITable>> = await getAllTables({
      current: searchParams.page ? searchParams.page : '1',
      pageSize: searchParams.size ? searchParams.size : '10',
      type: 'recycle',
      tbl_name: searchParams.search ? searchParams.search : ''
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
    if (res.statusCode === 200) {
      const data = res.data.result.flat()

      return (
        <div>
          <ContentLayout title='Danh sách bàn đã xóa'>
            <PageTables data={data} columns={columns} meta={res.data.meta} />
          </ContentLayout>
        </div>
      )
    }
  }

  if (id === 'edit') {
    const res: IBackendRes<ITable> = await findTableById({ _id: searchParams.id })

    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy bàn'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/tables?page=1&size=10'
        />
      )
    }

    if (res.code === -10) {
      return <LogoutPage />
      // redirect('/login')
    }
    if (res.code === -11) {
      return <ToastServer message='Bạn không có quyền truy cập' title='Lỗi' variant='destructive' />
    }
    if (!res || !res.data) {
      return (
        <ErrorPage />
      )
    }
    return (
      <ContentLayout title='Chỉnh sửa thông tin bàn'>
        <AddOrEdit id={searchParams.id} inforTable={res.data} />
      </ContentLayout>
    )
  }

  if (id === 'view') {
    const res: IBackendRes<ITable> = await findTableById({ _id: searchParams.id })

    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy bàn'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/tables?page=1&size=10'
        />
      )
    }

    if (res.code === -10) {
      return <LogoutPage />
      // redirect('/login')
    }
    if (res.code === -11) {
      return <ToastServer message='Bạn không có quyền truy cập' title='Lỗi' variant='destructive' />
    }
    if (!res || !res.data) {
      return (
        <ErrorPage />
      )
    }
    return (
      <ContentLayout title='Xem thông tin bàn'>
        <ViewTable inforTable={res.data} />
      </ContentLayout>
    )
  }
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
