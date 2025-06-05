import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import AddOrEdit from '../_component/AddOrEdit'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { IEmployee } from '../employees.interface'
import { findOneEmployee, getAllEmployees } from '../employees.api'
import { PageEmployees } from '../_component/PageEmployees'
import LogoutPage from '@/app/logout/page'
import { columns } from '../_component/columns'
import ErrorPage from '@/components/ErrorPage'
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
      <ContentLayout title='Thêm nhân viên'>

        <AddOrEdit id='add' />
      </ContentLayout>
    )
  }

  if (id === 'recycle') {
    const res: IBackendRes<IModelPaginate<IEmployee[]>> = await getAllEmployees({
      current: searchParams.page ? searchParams.page : '1',
      pageSize: searchParams.size ? searchParams.size : '10',
      epl_name: searchParams.search ? searchParams.search : '',
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
          <ContentLayout title='Danh sách nhân viên đã xóa'>

            <PageEmployees data={data} columns={columns} meta={res.data.meta} />
          </ContentLayout>
        </div>
      )
    }
  }

  if (id === 'edit') {
    const res: IBackendRes<IEmployee> = await findOneEmployee({ _id: searchParams.id })
    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy nhân viên'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/employees?page=1&size=10'
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
      <ContentLayout title='Chỉnh sửa thông tin nhân viên'>
        <AddOrEdit id={searchParams.id} inforEmployee={res.data} />
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
