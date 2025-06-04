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
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AddOrEdit from '../_component/AddOrEdit'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { columns } from '../_component/Columns'
import LogoutPage from '@/app/logout/page'
import ErrorPage from '@/components/ErrorPage'
import { IPolicy } from '../policy.interface'
import { findPolicyById, getAllPolicy } from '../policy.api'
import { PagePolicyes } from '../_component/PagePolicy'

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
      <ContentLayout title='Thêm quyền chức năng'>
        <AddOrEdit id='add' />
      </ContentLayout>
    )
  }

  if (id === 'recycle') {
    const res: IBackendRes<IModelPaginate<IPolicy>> = await getAllPolicy({
      current: searchParams.page ? searchParams.page : '1',
      pageSize: searchParams.size ? searchParams.size : '10',
      poly_name: searchParams.search ? searchParams.search : '',
      type: 'recycle'
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
          <ContentLayout title='Danh sách quyền chức năng đã xóa'>
            <PagePolicyes data={data} columns={columns} meta={res.data.meta} />
          </ContentLayout>
        </div>
      )
    }
  }

  const res: IBackendRes<IPolicy> = await findPolicyById({ _id: id })

  if (res.statusCode === 404) {
    return (
      <ToastServer
        message='Không tìm thấy quyền chức năng'
        title='Lỗi'
        variant='destructive'
        route='/dashboard/policy?page=1&size=10'
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
    <ContentLayout title='Chỉnh sửa thông tin quyền chức năng'>
      <AddOrEdit id={id} inforPolicy={res.data} />
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
