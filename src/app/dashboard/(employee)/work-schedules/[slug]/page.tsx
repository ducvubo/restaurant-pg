import { ContentLayout } from '@/components/admin-panel/content-layout'

import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import AddOrEdit from '../_component/AddOrEdit'
import dynamic from 'next/dynamic'
import LogoutPage from '@/app/logout/page'
import { IWorkSchedule } from '../work-schedule.interface'
import { getWorkScheduleById } from '../work-schedule.api'
import ErrorPage from '@/components/ErrorPage'
import ViewWorkSchedule from '../_component/ViewWorkSchedule'

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
      <ContentLayout title='Thêm lịch làm việc'>
        <AddOrEdit id='add' />
      </ContentLayout>
    )
  }
  if (id === 'edit') {
    const res: IBackendRes<IWorkSchedule> = await getWorkScheduleById({ id: searchParams.id })

    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy lịch làm việc'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/work-schedules'
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
      <ContentLayout title='Chỉnh sửa thông tin lịch làm việc'>
        <AddOrEdit id={searchParams.id} inforWorkSchedule={res.data} />
      </ContentLayout>
    )
  }

  if (id === 'view') {
    const res: IBackendRes<IWorkSchedule> = await getWorkScheduleById({ id: searchParams.id })

    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy lịch làm việc'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/work-schedules'
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
      <ContentLayout title='Xem thông tin lịch làm việc'>
        <ViewWorkSchedule inforWorkSchedule={res.data} />
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
