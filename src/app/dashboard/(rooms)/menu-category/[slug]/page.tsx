import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import AddOrEdit from '../_component/AddOrEdit'
import dynamic from 'next/dynamic'
import { columns } from '../_component/Columns'
import LogoutPage from '@/app/logout/page'
import { IMenuCategory } from '../menu-category.interface'
import { findMenuCategoryById, getAllMenuCategory } from '../menu-category.api'
import { PageMenuCategory } from '../_component/PageMenuCategory'

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
      <ContentLayout title='Thêm danh mục thực đơn'>
        <AddOrEdit id='add' />
      </ContentLayout>
    )
  }

  if (id === 'recycle') {
    const res: IBackendRes<IModelPaginate<IMenuCategory>> = await getAllMenuCategory({
      current: searchParams.page ? searchParams.page : '1',
      pageSize: searchParams.size ? searchParams.size : '10',
      type: 'recycle',
      mcat_name: ''
    })

    if (res.code === -10) {
      return <LogoutPage />
    }
    if (res.code === -11) {
      return <ToastServer message='Bạn không có quyền truy cập' title='Lỗi' variant='destructive' />
    }
    if (!res || !res.data) {
      return (
        <>
          <div>Error fetching data</div>
        </>
      )
    }
    if (res.statusCode === 200) {
      const data = res.data.result.flat()

      return (
        <div>
          <ContentLayout title='Danh sách danh mục thực đơn đã xóa'>
            <PageMenuCategory data={data} columns={columns} meta={res.data.meta} />
          </ContentLayout>
        </div>
      )
    }
  }

  const res: IBackendRes<IMenuCategory> = await findMenuCategoryById({ mcat_id: id })

  if (res.statusCode === 404) {
    return (
      <ToastServer
        message='Không tìm thấy danh mục thực đơn'
        title='Lỗi'
        variant='destructive'
        route='/dashboard/menu-category?page=1&size=10'
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
      <>
        <div>Error fetching data</div>
      </>
    )
  }
  return (
    <ContentLayout title='Chỉnh sửa thông tin danh mục thực đơn'>
      <AddOrEdit id={id} inforMenuCategory={res.data} />
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
