import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import ToastServer from '@/components/ToastServer'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import Link from 'next/link'
import LogoutPage from '@/app/logout/page'
import ErrorPage from '@/components/ErrorPage'
import { IPolicy } from './policy.interface'
import { getAllPolicy } from './policy.api'
import { PagePolicyes } from './_component/PagePolicy'
import { columns } from './_component/Columns'
interface PageProps {
  searchParams: { [key: string]: string }
}

async function Component({ searchParams }: PageProps) {
  const res: IBackendRes<IModelPaginate<IPolicy>> = await getAllPolicy({
    current: searchParams.page ? searchParams.page : '1',
    pageSize: searchParams.size ? searchParams.size : '10',
    poly_name: searchParams.search ? searchParams.search : '',
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
  // const data = res.data.result.flat()

  return (
    <div>
      <ContentLayout title='Danh sách quyền chức năng'>
        <PagePolicyes data={res.data.result} columns={columns} meta={res.data.meta} />
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
