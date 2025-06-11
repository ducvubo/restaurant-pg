import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import dynamic from 'next/dynamic'
import LogoutPage from '@/app/logout/page'
import AddOrEdit from '../_component/AddOrEdit'
import { getInforLeaveApplicationWithEmployee, getLeaveApplicationWithRestaurant } from '../leave-application.api'
import { ILeaveApplication } from '../leave-application.interface'
import ErrorPage from '@/components/ErrorPage'
import ViewLeaveApplication from '../_component/ViewLeaveApplication'

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
      <ContentLayout title='Thêm đơn xin nghỉ phép'>
        <AddOrEdit id='add' />
      </ContentLayout>
    )
  }
  if (id === 'edit') {
    let res: IBackendRes<ILeaveApplication> = await getInforLeaveApplicationWithEmployee(searchParams.id)

    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy đơn xin nghỉ phép'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/leave-application?page=1&size=10'
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
      <ContentLayout title='Chỉnh sửa thông tin đơn xin nghỉ phép'>
        <AddOrEdit id={searchParams.id} inforLeaveApplication={res.data} />
      </ContentLayout>
    )
  }
  if (id === 'view') {
    let res: IBackendRes<ILeaveApplication> = await getInforLeaveApplicationWithEmployee(searchParams.id)
    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy đơn xin nghỉ phép'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/leave-application?page=1&size=10'
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
      <ContentLayout title='Xem thông tin đơn xin nghỉ phép'>
        <ViewLeaveApplication inforLeaveApplication={res.data} />
      </ContentLayout>
    )
  }

  if (id === 'view-restaurant') {
    let res: IBackendRes<ILeaveApplication> = await getLeaveApplicationWithRestaurant(searchParams.id)
    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy đơn xin nghỉ phép'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/leave-application?page=1&size=10'
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
      <ContentLayout title='Xem thông tin đơn xin nghỉ phép'>
        <ViewLeaveApplication inforLeaveApplication={res.data} />
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
