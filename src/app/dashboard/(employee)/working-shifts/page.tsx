import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import ToastServer from '@/components/ToastServer'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { columns } from './_component/Columns'
import LogoutPage from '@/app/logout/page'
import { IWorkingShift } from './working-shift.interface'
import { getAllWorkingShifts } from './working-shift.api'
import { PageWorkingShifts } from './_component/PageWorkingShifts'
import ErrorPage from '@/components/ErrorPage'
interface PageProps {
  searchParams: { [key: string]: string }
}

async function Component({ searchParams }: PageProps) {
  const res: IBackendRes<IModelPaginate<IWorkingShift>> = await getAllWorkingShifts({
    pageIndex: searchParams.page ? searchParams.page : '1',
    pageSize: searchParams.size ? searchParams.size : '10',
    wks_name: searchParams.search ? searchParams.search : '',
    type: 'all'
  })

  if (res.code === -10) {
    return <LogoutPage />
  }
  if (res.code === -11) {
    return <ToastServer message='Bạn không có quyền truy cập' title='Lỗi' variant='destructive' />
  }
  if (!res || res.statusCode !== 200) {
    return (
      <ErrorPage />
    )
  }
  // const data = res.data.result.flat()
  if (res.data?.result) {
    return (
      <div>
        <ContentLayout title='Danh sách ca làm việc'>
          <PageWorkingShifts data={res.data?.result} columns={columns} meta={res.data.meta} />
        </ContentLayout>
      </div>
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
