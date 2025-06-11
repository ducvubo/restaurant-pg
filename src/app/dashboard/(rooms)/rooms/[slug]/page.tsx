import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import AddOrEdit from '../_component/AddOrEdit'
import dynamic from 'next/dynamic'
import { columns } from '../_component/Columns'
import LogoutPage from '@/app/logout/page'
import { IRoom } from '../rooms.interface'
import { findRoomById, getAllRoom } from '../rooms.api'
import { PageRoom } from '../_component/PageRoom'
import ErrorPage from '@/components/ErrorPage'
import ViewRoom from '../_component/ViewRoom'

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
      <ContentLayout title='Thêm phòng/sảnh'>
        <AddOrEdit id='add' />
      </ContentLayout>
    )
  }

  if (id === 'recycle') {
    const res: IBackendRes<IModelPaginate<IRoom>> = await getAllRoom({
      current: searchParams.page ? searchParams.page : '1',
      pageSize: searchParams.size ? searchParams.size : '10',
      type: 'recycle',
      room_name: searchParams.search ? searchParams.search : ''
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
          <ContentLayout title='Danh sách phòng/sảnh đã xóa'>
            <PageRoom data={data} columns={columns} meta={res.data.meta} />
          </ContentLayout>
        </div>
      )
    }
  }
  if (id === 'edit') {
    const res: IBackendRes<IRoom> = await findRoomById({ room_id: searchParams.id })

    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy phòng/sảnh'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/rooms?page=1&size=10'
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
      <ContentLayout title='Chỉnh sửa thông tin phòng/sảnh'>
        <AddOrEdit id={searchParams.id} inforRoom={res.data} />
      </ContentLayout>
    )
  }

  if (id === 'view') {
    const res: IBackendRes<IRoom> = await findRoomById({ room_id: searchParams.id })

    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy phòng/sảnh'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/rooms?page=1&size=10'
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
      <ContentLayout title='Xem thông tin phòng/sảnh'>
        <ViewRoom inforRoom={res.data} />
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
