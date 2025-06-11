import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import AddOrEdit from '../_component/AddOrEdit'
import dynamic from 'next/dynamic'
import { columns } from '../_component/Columns'
import LogoutPage from '@/app/logout/page'
import { IMenuItems } from '../menu-items.interface'
import { findMenuItemsById, getAllMenuItems } from '../menu-items.api'
import { PageMenuItems } from '../_component/PageMenuItems'
import ErrorPage from '@/components/ErrorPage'
import ViewMenuItems from '../_component/ViewMenuItems'

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
      <ContentLayout title='Thêm thực đơn'>
        <AddOrEdit id='add' />
      </ContentLayout>
    )
  }

  if (id === 'recycle') {
    const res: IBackendRes<IModelPaginate<IMenuItems>> = await getAllMenuItems({
      current: searchParams.page ? searchParams.page : '1',
      pageSize: searchParams.size ? searchParams.size : '10',
      type: 'recycle',
      mitems_name: searchParams.search ? searchParams.search : ''
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
          <ContentLayout title='Danh sách thực đơn đã xóa'>
            <PageMenuItems data={data} columns={columns} meta={res.data.meta} />
          </ContentLayout>
        </div>
      )
    }
  }
  if (id === 'edit') {
    const res: IBackendRes<IMenuItems> = await findMenuItemsById({ mitems_id: searchParams.id })

    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy thực đơn'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/menu-items?page=1&size=10'
        />
      )
    }

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
    return (
      <ContentLayout title='Chỉnh sửa thông tin thực đơn'>
        <AddOrEdit id={searchParams.id} inforMenuItems={res.data} />
      </ContentLayout>
    )
  }

  if (id === 'view') {
    const res: IBackendRes<IMenuItems> = await findMenuItemsById({ mitems_id: searchParams.id })

    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy thực đơn'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/menu-items?page=1&size=10'
        />
      )
    }

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
    return (
      <ContentLayout title='Xem thông tin thực đơn'>
        <ViewMenuItems inforMenuItems={res.data} />
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
