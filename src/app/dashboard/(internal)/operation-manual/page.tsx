import React, { Suspense } from 'react'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import LoadingServer from '@/components/LoadingServer'
import ToastServer from '@/components/ToastServer'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { columns } from './_component/Columns'
import LogoutPage from '@/app/logout/page'
import { IOperationManual } from './operation-manual.interface'
import { getAllOperationManuals } from './operation-manual.api'
import { PageOperationManual } from './_component/PageOperationManual'
import ErrorPage from '@/components/ErrorPage'

interface PageProps {
  searchParams: { [key: string]: string }
}

async function Component({ searchParams }: PageProps) {
  const res: IBackendRes<IModelPaginate<IOperationManual>> = await getAllOperationManuals({
    current: searchParams.page ? searchParams.page : '1',
    pageSize: searchParams.size ? searchParams.size : '10',
    OperaManualTitle: searchParams.search ? searchParams.search : '',
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
  const data = (res.data.result ? res.data.result : []).flat()

  return (
    <div>
      <ContentLayout title='Danh sách tài liệu vận hành'>
        <PageOperationManual data={data} columns={columns} meta={res.data.meta} />
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
